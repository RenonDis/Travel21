function Accordion(options) {
    'use strict';

    // Declare variables
    var o = options || {
        containerSelector: '.accordion-instance',
        itemSelector: '.accordion-item',
        toggleSelector: '.accordion-toggle'
    },
    container,
    openItem;
    bindEventListeners();

    /*
     * Handle clicks on container element
     */
    function bindEventListeners() {
        container = document.querySelector(o.containerSelector);
        container.addEventListener('click', clickHandler, false);
    }

    function clickHandler(e) {
        // If target of click contains class in o.toggleSelector...
        if(e.target.classList.contains(o.toggleSelector.slice(- o.toggleSelector.length + 1))) {
            open(e.target.parentElement);
        }
    }

    // Close open item and expand new item
    function open(element) {
        openItem = element.querySelector('.expanded');
        //openItem = container.querySelector('.expanded');

        if(openItem) {
            requestAnimationFrame(function() {
                openItem.classList.toggle('expanded');
            });
        }

        requestAnimationFrame(function() {
            element.classList.toggle('expanded');
        });
    }

    return {
        // Utility function to open item at specific index
        openItemAtIndex: function(index) {
            open(document.querySelectorAll(o.itemSelector)[index]);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var accordionInstance = new Accordion({
        containerSelector: '.accordion-instance',
        itemSelector: '.accordion-item',
        toggleSelector: '.accordion-toggle'
    });
});