class ResumeSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const elementStyleLink = document.createElement('link');
        elementStyleLink.rel = 'stylesheet';
        elementStyleLink.href = './styles/resume-section-style.css';
        elementStyleLink.type = 'text/css';
        const rootStyleLink = document.createElement('link');
        rootStyleLink.rel = 'stylesheet';
        rootStyleLink.href = './styles/root-styles.css';
        rootStyleLink.type = 'text/css';

        // Container element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-section-wrapper');

        // Header itself
        this.content = document.createElement('div');
        this.content.setAttribute('class', 'resume-section');
        this.content.defaultContent = "Default resume section text.";

        // Content which can be folded, inherits from HTML structure
        this.subcontent = document.createElement('div');
        const slot = document.createElement('slot');

        // Build the structure of the tree
        this.wrapper.appendChild(this.content);
        this.wrapper.appendChild(this.subcontent);
        this.shadowRoot.append(this.wrapper);
        this.shadowRoot.append(rootStyleLink);
        this.shadowRoot.append(elementStyleLink);
        this.subcontent.appendChild(slot);

        // Listen to mouse events
        this._initEvents(this.content, this.subcontent);
    }

    connectedCallback() {
        this.content.textContent = this.getAttribute('section-text') || this.content.defaultContent;
    }

    _initEvents(content, subcontent) {
        // Default to open
        subcontent.style.display = 'block';
        content.addEventListener('click', () => this._toggleContent(subcontent));
    }

    _toggleContent(content) {
        content.style.display = content.style.display=='block'? 'none' : 'block'
    }
}

customElements.define('resume-section', ResumeSection);