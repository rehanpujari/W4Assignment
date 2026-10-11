const slider = document.querySelector("[data-slider]");
const track = slider.querySelector(".slider__track");
const slides = [...track.children];
const total = slides.length;

// Clone last slide to the front and first slide to the end for seamless looping
track.prepend(slides[total - 1].cloneNode(true));
track.append(slides[0].cloneNode(true));

let index = 1;     // position in the track (1 = first real slide)
let busy = false;  // true while a slide animation is running

// Build arrows
function makeButton(className, label, text) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.setAttribute("aria-label", label);
  btn.textContent = text;
  return btn;
}

const prevBtn = makeButton("slider__arrow slider__arrow--prev", "Previous slide", "❮");
const nextBtn = makeButton("slider__arrow slider__arrow--next", "Next slide", "❯");

// Build dots
const dotsWrap = document.createElement("div");
dotsWrap.className = "slider__dots";

const dots = slides.map((_, i) => {
  const dot = makeButton("slider__dot", `Go to slide ${i + 1}`, "");
  dot.addEventListener("click", () => go(i + 1));
  dotsWrap.append(dot);
  return dot;
});

slider.append(prevBtn, nextBtn, dotsWrap);

// Move the track and highlight the active dot
function show(animate = true) {
  track.classList.toggle("is-instant", !animate);
  track.style.transform = `translateX(${-index * 100}%)`;
  if (!animate) track.offsetWidth; // force reflow so the jump isn't animated

  const active = (index - 1 + total) % total;
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
}

function go(newIndex) {
  if (busy || newIndex === index) return;
  busy = true;
  index = newIndex;
  show();
}

// After sliding onto a clone, silently jump to the real slide
track.addEventListener("transitionend", () => {
  if (index === total + 1) index = 1;
  else if (index === 0) index = total;
  show(false);
  busy = false;
});

prevBtn.addEventListener("click", () => go(index - 1));
nextBtn.addEventListener("click", () => go(index + 1));

show(false);