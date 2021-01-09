import Absctract from '../view/abstract';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (target, markup, place) => {
  if (markup instanceof Absctract) {
    markup = markup.getElement();
  }

  if (target instanceof Absctract) {
    target = target.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      target.prepend(markup);
      break;
    case RenderPosition.BEFOREEND:
      target.append(markup);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Absctract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Absctract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  parent.replaceChild(newChild, oldChild);
};
