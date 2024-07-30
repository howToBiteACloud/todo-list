export function updateMySvgForRender(elem) {
  const url = elem.getAttribute('src');

  elem.style.setProperty('--t-mask', `url(${url})`);
}

export function createSvg(iconName) {
  const svg = document.createElement('my-svg');

  svg.setAttribute('src', `https://taiga-ui.dev/assets/taiga-ui/icons/${iconName}.svg?v=3.72.0`);

  updateMySvgForRender(svg);

  return svg;
}