class ResumeHeaderName extends HTMLElement {
    constructor() {
        super();

        // Import styles
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-header-style.css';
        link.type = 'text/css';

        // This only has a name element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-header-name');
        this.wrapper.defaultContent = "Lorem Ipsum";

        // Build DOM
        this.appendChild(this.wrapper);
        this.appendChild(link);
    }

    connectedCallback() {
        this.wrapper.textContent = this.getAttribute('myname') || this.wrapper.defaultContent;
    }
}
customElements.define('resume-header-name', ResumeHeaderName)


class ResumeHeaderContactBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-header-style.css';
        link.type = 'text/css';

        // Containing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-header-contact-bar');

        // Subcontent slot
        const subcontent = document.createElement('slot');

        this.wrapper.appendChild(subcontent);
        this.shadowRoot.append(this.wrapper);
        this.shadowRoot.append(link);
    }
}
customElements.define('resume-header-contact-bar', ResumeHeaderContactBar);


class ResumeHeaderContactItem extends HTMLElement {
    constructor() {
        super();
        
        // Import styles
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-header-style.css';
        link.type = 'text/css';

        // Containing element
        const wrapper = document.createElement('a');
        wrapper.classList.add('resume-header-contact-item');

        // Get the passed attributes
        const url = this.getAttribute('contact-url');
        const text = this.getAttribute('contact-text');

        if (url) {
            wrapper.href = url;
            wrapper.target = '_blank'; // open in new tab
        }
        wrapper.innerHTML = text;

        this.appendChild(wrapper);
        this.appendChild(link);
    }
}
customElements.define('resume-header-contact-item', ResumeHeaderContactItem);