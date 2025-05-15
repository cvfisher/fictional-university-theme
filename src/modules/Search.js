class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.addSearchHTML();
		this.resultsDiv = document.querySelector("#search-overlay__results");
		this.openButton = document.querySelectorAll(".js-search-trigger");
		this.closeButton = document.querySelector(".search-overlay__close");
		this.searchOverlay = document.querySelector(".search-overlay");
		this.searchField = document.querySelector("#search-term");
		this.events();
		this.isOverlayOpen = false;
		this.isSpinnerVisible = false;
		this.typingTimer;
		this.previousValue;
	}

	// 2. events
	events() {
		this.openButton.forEach((button) =>
			button.addEventListener("click", () => this.openOverlay())
		);
		this.closeButton.addEventListener("click", () => this.closeOverlay());
		document.addEventListener("keydown", (e) => this.keyPressDispatcher(e));
		this.searchField.addEventListener("keyup", () => this.typingLogic());
	}

	openOverlay() {
		this.searchOverlay.classList.add("search-overlay--active");
		this.searchField.value = "";
		setTimeout(() => this.searchField.focus(), 301);
		document.body.classList.add("body-no-scroll"); //Uses overflow: hidden
		this.isOverlayOpen = true;
	}

	closeOverlay() {
		this.searchOverlay.classList.remove("search-overlay--active");
		this.isOverlayOpen = false;
		document.body.classList.remove("body-no-scroll");
	}

	// 3. methods (function, action...)
	typingLogic() {
		if (this.searchField.value !== this.previousValue) {
			clearTimeout(this.typingTimer);

			if (this.searchField.value) {
				if (!this.isSpinnerVisible) {
					this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(() => this.getResults(), 750);
			} else {
				this.resultsDiv.innerHTML = "";
				this.isSpinnerVisible = false;
			}
		}
		this.previousValue = this.searchField.value;
	}

	async getResults() {
		try {
			const searchTerm = encodeURIComponent(this.searchField.value);

			const [postsResponse, pagesResponse] = await Promise.all([
				fetch(
					`${universityData.root_url}/wp-json/wp/v2/posts?search=${searchTerm}`
				),
				fetch(
					`${universityData.root_url}/wp-json/wp/v2/pages?search=${searchTerm}`
				),
			]);

			const posts = await postsResponse.json();
			const pages = await pagesResponse.json();

			const combinedResults = [...posts, ...pages];

			this.resultsDiv.innerHTML = `
      <h2 class="search-overlay__section-title">General Information</h2>
      ${
				combinedResults.length
					? '<ul class="link-list min-list">'
					: "<p>No general information matches this search.</p>"
			}
      ${combinedResults
				.map(
					(item) =>
						`<li><a href="${item.link}">${item.title.rendered}</a>${
							item.type === "post"
								? ` by <strong>${item.authorName}</strong>`
								: ""
						}</li>`
				)
				.join("")}
      ${combinedResults.length ? "</ul>" : ""}
    `;

			this.isSpinnerVisible = false;
		} catch (error) {
			this.resultsDiv.innerHTML = "<p>Error loading search results</p>";
			console.error("Search error:", error);
			this.isSpinnerVisible = false;
		}
	}

	keyPressDispatcher(e) {
		const noInputFocused = !["INPUT", "TEXTAREA"].includes(
			document.activeElement.tagName
		);

		if (e.key === "s" && !this.isOverlayOpen && noInputFocused) {
			this.openOverlay();
		}

		if (e.key === "Escape" && this.isOverlayOpen) {
			this.closeOverlay();
		}
	}
	addSearchHTML() {
		document.body.insertAdjacentHTML(
			"beforeend",
			`
  <div class="search-overlay">
    <div class="search-overlay__top">
      <div class="container">
        <i class="fa fa-search fa-2x search-overlay__icon" aria-hidden="true"></i>
        <input type="text" class="search-term" id="search-term" autocomplete="off" placeholder="What are you looking for?">
        <i class="fa fa-window-close fa-2x search-overlay__close" aria-hidden="true"></i>
      </div>
    </div>
    <div class="container">
      <div id="search-overlay__results"></div>
    </div>
  </div>
`
		);
	}
}

export default Search;
