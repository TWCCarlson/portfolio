class ClickMe extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/click-me-style.css';
        rootStyleLink.type = 'text/css';

        // Containing element
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'click-me');

        // Image
        // const image = document.createElement('img');
        // image.classList.add('click-me-image');
        // image.src = "click-me-arrow.png";
        // wrapper.appendChild(image);
        // this.shadowRoot.appendChild(image);
        
        const headsup = document.createElement('div');
        headsup.classList.add('click-me-text');
        headsup.innerHTML = "Note: click any section with <span style=color:var(--interactable)>></span> to see details"
        this.shadowRoot.appendChild(headsup)
        // this.shadowRoot.appendChild(wrapper);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: relative; /* Ensure it's positioned relatively to the surrounding context */
                display: block; /* Make sure the host element behaves as a block */
                width: 100%; /* Ensure it spans the full width of its container */
                height: 0; /* Collapse the height to overlay on the target */
            }
            .click-me-image {
                position: absolute;
                top: 0; /* Align with the top of the line of text */
                left: 0; /* Adjust as necessary to align with the target text */
                transform: translateY(-100%); /* Pull the image up above the element */
                height: 6rem; /* Scale to match the line-height of the text */
                z-index: 10; /* Ensure it's above other content */
            }
        `;

        // Build structure
        this.shadowRoot.appendChild(rootStyleLink);
        // this.shadowRoot.append(style, image);
    }
}
customElements.define('click-me', ClickMe);