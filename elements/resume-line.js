import { elementTogglesContent } from "../shared-modules/toggle-container.js";

class ResumeLine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = './styles/resume-line-style.css';
        styleLink.type = 'text/css';
        const colorsLink = document.createElement('link');
        colorsLink.rel = 'stylesheet';
        colorsLink.href = './styles/colors.css';
        colorsLink.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-wrapper');

        // Pop-up trigger element
        this.trigger = document.createElement('div');
        this.trigger.setAttribute('class', 'resume-line');
        this.trigger.defaultContent = "Default resume line text.";
        
        // Create the content element
        this.content = document.createElement('div');
        this.content.setAttribute('class', 'resume-line-content');

        // Prepare to load content into the slot
        this.detailSlot = document.createElement('slot');
        this.detailSlotFilled = false;
        this.content.appendChild(this.detailSlot);
        
        // Build the structure of the tree
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.content);
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(colorsLink);

        const spacer = document.createElement('div');
        spacer.setAttribute('class', 'resume-line-spacer');
        this.shadowRoot.appendChild(spacer)
    }

    connectedCallback() {
        // Create the line's content
        const bulletDepth = this.getAttribute('indent-depth');
        const depthCharMap = {
            "0": ["", "0in", "0in"],
            "1": ["•", "0.20in", "0in"],
            "2": ["◦", "0.20in", "0.20in"]
        }
        // Only make the bullet point element if it should exist (not 0-indent)
        if (depthCharMap[bulletDepth][1]!='0in') {
            const lineBullet = document.createElement('div');
            lineBullet.setAttribute('class', 'resume-line-bullet');
            lineBullet.innerHTML = depthCharMap[bulletDepth][0];
            lineBullet.style.width = depthCharMap[bulletDepth][1];
            lineBullet.style.marginLeft = depthCharMap[bulletDepth][2];
            this.trigger.appendChild(lineBullet)
        }

        // Create the line text
        this.lineText = document.createElement('div');
        this.lineText.innerHTML = this.getAttribute('line-text') || this.trigger.defaultContent;
        this.trigger.appendChild(this.lineText);

        // Implement interactivity if there is slot content
        const assignedNodes = this.detailSlot.assignedNodes().filter(node => {
            return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        })

        this.detailSlot.addEventListener('slotchange', () => {
            if (!this.detailSlotFilled && !(assignedNodes.length === 0)) {
                this.detailSlotFilled = true;
                // If content is added to the slot, make it
                const contentWrapper = elementTogglesContent(this.trigger, this.content);
                this.wrapper.appendChild(contentWrapper);
            }
        });
    }
}
customElements.define('resume-line', ResumeLine);


class ResumeLineDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Import styles to the shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/resume-line-style.css';
        link.type = 'text/css';

        // Placing element
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'resume-line-detail-wrapper');

        // Build the shadow DOM
        this.shadowRoot.appendChild(this.wrapper);
        this.shadowRoot.appendChild(link)
    }

    connectedCallback() {
        // Text content of the line details
        const content = document.createElement('div');
        content.setAttribute('class', 'resume-line-expanded');
        content.defaultContent = "This is an explanation of my role at Company."
        content.innerHTML = this.getAttribute('detail-text') || content.defaultContent;
        this.wrapper.appendChild(content);

        // Embedded video
        const videoURL = this.getAttribute('video-url');
        if (videoURL) {
            const videoEmbed = document.createElement('div');
            videoEmbed.setAttribute('class', 'resume-line-detail-video')
            this.wrapper.appendChild(videoEmbed);
            let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            let match = videoURL.match(regExp);
            if (match && match[2].length == 11) {
                videoEmbed.innerHTML = '<iframe width="560" height="315" \
                                        src="https://www.youtube.com/embed/'
                                        + match[2] 
                                        + '" frameborder="0" allowfullscreen></iframe>';
            } else {
                return 'error';
            }
        }
        
        // Read more style link to another page on the site
        const articleURL = this.getAttribute('article-url');
        if (articleURL) {
            // Container
            const urlContainer = document.createElement('div');
            urlContainer.style.textAlign = 'right';
            this.wrapper.appendChild(urlContainer);
            // Hyperlink
            const readMore = document.createElement('a');
            readMore.href = articleURL;
            readMore.innerHTML = "Read More >>";
            readMore.setAttribute('class', 'resume-line-detail-readmore');
            urlContainer.appendChild(readMore)
        }
    }
}
customElements.define('resume-line-detail', ResumeLineDetail)