class ResumeSubSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-subsection-style.css';
        link.type = 'text/css';
        
        // Container element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-subsection-wrapper');

        // Clickable content folder
        this.trigger = document.createElement('div');
        this.trigger.setAttribute('class', 'resume-subsection');
        this.trigger.defaultContent = "Default resume line text.";
        this.expandedState = true;

        // Subsection text container
        this.content = document.createElement('div');
        this.detailSlot = document.createElement('slot');
        this.content.appendChild(this.detailSlot);

        // Build the structure of the shadow DOM
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.content);
        this.shadowRoot.append(this.wrapper);
        this.shadowRoot.append(link);
    }

    connectedCallback() {
        // Create left, center, and right text elements if requested
        let left = this.getAttribute('left-text');
        if (left) {
            this.leftText = document.createElement('span');
            this.leftText.setAttribute('class', 'resume-subsection-left-text');
            this.leftText.innerHTML = left;
            this.trigger.appendChild(this.leftText);
        }
        let center = this.getAttribute('center-text');
        if (center) {
            this.centerText = document.createElement('span');
            this.centerText.setAttribute('class', 'resume-subsection-center-text');
            this.centerText.innerHTML = center;
            this.trigger.appendChild(this.centerText);
        }
        let right = this.getAttribute('right-text');
        if (right) {
            this.rightText = document.createElement('span');
            this.rightText.setAttribute('class', 'resume-subsection-right-text');
            this.rightText.innerHTML = right;
            this.trigger.appendChild(this.rightText);
        }
        if (center && !right && !left) {
            this.trigger.style.justifyContent = 'center';
        }

        // Content should be visible at first
        this.content.style.display = 'block'

        this.detailSlot.addEventListener('slotchange', () => {
            const assignedElements = this.detailSlot.assignedElements();
            if (assignedElements.length > 0) {
                this._initEvents(this.trigger, this.content);
            }
        })
    }

    _initEvents(trigger, content) {
        trigger.addEventListener('click', () => this._toggleContent(content));
    }

    _toggleContent(content) {
        this.expandedState = content.style.display=='block' ? false : true;
        content.style.display = this.expandedState==false ? 'none' : 'block';
    }
}
customElements.define('resume-subsection', ResumeSubSection);