class Card extends react.Component {
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.href = "/" + URI.from(this.uri).toURLPath();

        const uriType = Spicetify.URI.fromString(this.uri)?.type;
        switch (uriType) {
            case Spicetify.URI.Type.ALBUM:
            case Spicetify.URI.Type.TRACK:
                this.menuType = Spicetify.ReactComponent.AlbumMenu;
                break;
            case Spicetify.URI.Type.ARTIST:
                this.menuType = Spicetify.ReactComponent.ArtistMenu;
                break;
            case Spicetify.URI.Type.PLAYLIST:
            case Spicetify.URI.Type.PLAYLIST_V2:
                this.menuType = Spicetify.ReactComponent.PlaylistMenu;
                break;
            case Spicetify.URI.Type.SHOW:
                this.menuType = Spicetify.ReactComponent.PodcastShowMenu;
                break;
        }
        this.menuType = this.menuType || "div";
    }

    play(event) {
        const api = Spicetify.Player.origin2 || Spicetify.PlaybackControl.playUri;
        api.playUri(this.uri);
        event.stopPropagation();
    }

    getSubtitle() {
        let subtitle;
        if (this.type === "Album" || this.type === "Track") {
            subtitle = this.subtitle.map((artist) => {
                const artistHref = "/" + URI.from(artist.uri).toURLPath();
                return react.createElement("a", {
                    className: `main-type-mesto reddit-cardSubHeader`,
                    href: artistHref,
                    onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        History.push(artistHref);
                    },
                }, react.createElement("span", null, artist.name));
            });
            // Insert commas between elements
            subtitle = subtitle.flatMap((el, i, arr) => (arr.length - 1) !== i ? [el, ", "] : el);
        } else {
            subtitle = react.createElement("div", {
                className: `${this.visual.longDescription ? "reddit-longDescription " : ""}main-cardSubHeader-root main-type-mesto reddit-cardSubHeader`,
                as: "div",
            }, react.createElement("span", null, this.subtitle))
        }
        return subtitle;
    }

    render() {
        let detail = [];
        this.visual.type && detail.push(this.type);
        this.visual.upvotes && detail.push(`▲ ${this.upvotes}`);

        return react.createElement(Spicetify.ReactComponent.RightClickMenu || "div", {
            menu: react.createElement(this.menuType, { uri: this.uri, }),
        }, react.createElement("div", {
            className: "main-card-card",
            onClick: (event) => {
                History.push(this.href);
                event.preventDefault();
            },
        }, react.createElement("div", {
            className: "main-card-draggable",
            draggable: "true"
        }, react.createElement("div", {
            className: "main-card-imageContainer"
        }, react.createElement("div", {
            className: "main-cardImage-imageWrapper"
        }, react.createElement("div", {
        }, react.createElement("img", {
            "aria-hidden": "false",
            draggable: "false",
            loading: "lazy",
            src: this.imageURL,
            alt: "",
            className: "main-image-image main-cardImage-image"
        }))), react.createElement("div", {
            className: "main-card-PlayButtonContainer"
        }, react.createElement("button", {
            className: "main-playButton-PlayButton main-playButton-primary",
            "aria-label": "Play",
            style: { "--size": "40px" },
            onClick: this.play.bind(this),
        }, react.createElement("svg", {
            height: "16",
            role: "img",
            width: "16",
            viewBox: "0 0 24 24",
            "aria-hidden": "true"
        }, react.createElement("polygon", {
            points: "21.57 12 5.98 3 5.98 21 21.57 12",
            fill: "currentColor"
        }))))), react.createElement("div", {
            className: "main-card-cardMetadata"
        }, react.createElement("a", {
            draggable: "false",
            title: this.title,
            className: "main-cardHeader-link",
            dir: "auto",
            href: this.href
        }, react.createElement("div", {
            className: "main-cardHeader-text main-type-balladBold",
            as: "div"
        }, this.title)), detail.length > 0 && react.createElement("div", {
            className: "main-cardSubHeader-root main-type-mestoBold reddit-cardSubHeader",
            as: "div",
        }, react.createElement("span", null, detail.join(" ‒ ")),
        ), this.visual.followers && (this.type === "Playlist") && react.createElement("div", {
            className: "main-cardSubHeader-root main-type-mestoBold reddit-cardSubHeader",
            as: "div",
        }, react.createElement("span", null, `${this.followersCount} followers`)
        ), this.getSubtitle(),
        ))));
    }
}
