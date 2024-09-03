export function elementTogglesContent(wrapper, element, content) {
    // This function gives the ability to smoothly unfold content to an element
    // And the ability to re-fold when the content is clicked

    // Import styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = './shared-modules/toggle-container-style.css';
    styleLink.type = 'text/css';

    // Create a subcontainer for evaluating natural height
    const foldWrapper = document.createElement('div');
    foldWrapper.setAttribute('class', 'foldable-content-wrapper');
    foldWrapper.appendChild(content);
    foldWrapper.appendChild(styleLink);

    // Add class and events
    wrapper.classList.add('content-folder')
    wrapper.addEventListener('click', () => changeHeaderClass(element));
    wrapper.addEventListener('click', () => toggleContent(foldWrapper));

    // Attach content to wrapper
    wrapper.appendChild(foldWrapper);
}

function changeHeaderClass(element) {
    element.classList.toggle('active');
    element.classList.toggle('resume-line-expanded');
}

function toggleContent(content) {
    console.log("CLICK", content.classList);
    // Scroll to the content after the transition
    content.addEventListener('transitionend', (event) => {
        onTransitionEnd(event, content);
    });

    // Toggle content visibility with a transition
    const naturalHeight = content.scrollHeight
    if (!content.isExpanded) {
        content.style.maxHeight = `${naturalHeight}px`;
        content.isExpanded = true;
    } else {
        content.style.maxHeight = '0px';
        content.isExpanded = false;
    }
}

function onTransitionEnd(event, content) {
    content.removeEventListener('transitionend', onTransitionEnd)
    if (content.style.maxHeight !== '0px') {
        content.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
}
