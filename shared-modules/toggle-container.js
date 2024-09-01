export function elementTogglesContent(element, content) {
    // This function gives the ability to smoothly unfold content to an element
    // And the ability to re-fold when the content is clicked

    // Import styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = './shared-modules/toggle-container-style.css';
    styleLink.type = 'text/css';

    // Create container to animate the folding
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'foldable-content-wrapper');
    
    element.addEventListener('click', () => toggleContent(wrapper));
    content.addEventListener('click', () => toggleContent(wrapper));
    element.parentElement.classList.add('content-folder')
    
    // element.appendChild(wrapper);
    wrapper.appendChild(styleLink);
    wrapper.appendChild(content);
    return wrapper
}

function toggleContent(content) {
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
