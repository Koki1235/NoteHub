'use strict';



// tooltip adjustment-------------------------------

export const Tooltip = function (element) {

  const toolTip = document.createElement('span');
  toolTip.classList.add('tooltip', 'text-body-small');

  element.addEventListener('mouseenter', () => {
    const tooltip = element.dataset.tooltip;
    toolTip.textContent = tooltip;
    const {
      top,
      left,
      height,
      width
    } = element.getBoundingClientRect();
    toolTip.style.top = top + height + 4 + 'px';
    toolTip.style.left = left + (width / 2) + 'px';
    toolTip.style.transform = 'translate(-50%, 20%)';
    document.body.appendChild(toolTip)
  });

  element.addEventListener('mouseleave', toolTip.remove.bind(toolTip));

};
