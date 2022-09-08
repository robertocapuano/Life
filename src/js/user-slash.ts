import TinyGesture from 'tinygesture';
import { LOGI } from "./logs";
import { TTWORLD } from "./WorldRefs";

// https://npm.io/package/tinygesture

export class UserSlash
{
    private gesture: TinyGesture;
 
    constructor(
    ) {
    }

    setup() {
        const options = {
            // Used to calculate the threshold to consider a movement a swipe. it is
            // passed type of 'x' or 'y'.
            threshold: (type, self) =>
              Math.max(
                25,
                // type === 'x' ? 50 : 22,
                Math.floor(
                  0.15 *
                    (type === 'x'
                      ? window.innerWidth || document.body.clientWidth
                      : window.innerHeight || document.body.clientHeight)
                )
              ),
            // Minimum velocity the gesture must be moving when the gesture ends to be
            // considered a swipe.
            velocityThreshold: 10,
            // Used to calculate the distance threshold to ignore the gestures velocity
            // and always consider it a swipe.
            disregardVelocityThreshold: (type, self) =>
              Math.floor(0.15 * (type === 'x' ? self.element.clientWidth : self.element.clientHeight)),
            // Point at which the pointer moved too much to consider it a tap or longpress
            // gesture.
            pressThreshold: 8,
            // If true, swiping in a diagonal direction will fire both a horizontal and a
            // vertical swipe.
            // If false, whichever direction the pointer moved more will be the only swipe
            // fired.
            diagonalSwipes: false,
            // The degree limit to consider a swipe when diagonalSwipes is true.
            diagonalLimit: Math.tan(((45 * 1.5) / 180) * Math.PI),
            // Listen to mouse events in addition to touch events. (For desktop support.)
            mouseSupport: true,
          };

        this.gesture = new TinyGesture(TTWORLD.canvas,options);

        this.gesture.on('panstart', (event) => {
            // Always the original mouse or touch event.
            // This service uses passive listeners, so you can't call
            // event.preventDefault() on any of the events.
            event;
            // The (screen) x coordinate of the start of the gesture.
            this.gesture.touchStartX;
            // The (screen) y coordinate of the start of the gesture.
            this.gesture.touchStartY;
            LOGI('panstart');

            // find gate
          });
          this.gesture.on('panmove', (event) => {
            // Everything from panstart, and...
          
            // The amount the gesture has moved in the x direction.
            this.gesture.touchMoveX;
            // The amount the gesture has moved in the y direction.
            this.gesture.touchMoveY;
            // The instantaneous velocity in the x direction.
            this.gesture.velocityX;
            // The instantaneous velocity in the y direction.
            this.gesture.velocityY;
            // Boolean, whether the gesture has passed the swiping threshold in the x
            // direction.
            this.gesture.swipingHorizontal;
            // Boolean, whether the gesture has passed the swiping threshold in the y
            // direction.
            this.gesture.swipingVertical;
            // Which direction the gesture has moved most. Prefixed with 'pre-' if the
            // gesture hasn't passed the corresponding threshold.
            // One of: ['horizontal', 'vertical', 'pre-horizontal', 'pre-vertical']
            this.gesture.swipingDirection;
            // To tell if the gesture is a left swipe, you can do something like this:
            // if (this.gesture.swipingDirection === 'horizontal' && this.gesture.touchMoveX < 0) {
            //   alert('You are currently swiping left.');
            // }

            //   if (this.gesture.swipingDirection === 'horizontal' && this.gesture.touchMoveX > 0) {
            //     alert('You are currently swiping right.');
            // }
            LOGI('panmove');

          });
          this.gesture.on('panend', (event) => {
            // Everything from panstart and panmove, and...
          
            // The (screen) x coordinate of the end of the gesture.
            this.gesture.touchEndX;
            // The (screen) y coordinate of the end of the gesture.
            this.gesture.touchEndY;
          
            // Swipe events are fired depending on the touch end coordinates, so
            // properties like swipingDirection may be incorrect at this point, since
            // they're based on the last touch move coordinates.
            LOGI('panend');

          });
        /*
          this.gesture.on('swiperight', (event) => {
            // The gesture was a right swipe.
          
            // This will always be true for a right swipe.
            this.gesture.swipedHorizontal;
            // This will be true if diagonalSwipes is on and the gesture was diagonal
            // enough to also be a vertical swipe.
            this.gesture.swipedVertical;
            LOGI('swiperight');
          });
          this.gesture.on('swipeleft', (event) => {
            // The gesture was a left swipe.
          
            // This will always be true for a left swipe.
            this.gesture.swipedHorizontal;
            // This will be true if diagonalSwipes is on and the gesture was diagonal
            // enough to also be a vertical swipe.
            this.gesture.swipedVertical;
            LOGI('swipeleft');
          });
          this.gesture.on('swipeup', (event) => {
            // The gesture was an upward swipe.
          
            // This will be true if diagonalSwipes is on and the gesture was diagonal
            // enough to also be a horizontal swipe.
            this.gesture.swipedHorizontal;
            // This will always be true for an upward swipe.
            this.gesture.swipedVertical;
            LOGI('swipeup');
          });
          this.gesture.on('swipedown', (event) => {
            // The gesture was a downward swipe.
          
            // This will be true if diagonalSwipes is on and the gesture was diagonal
            // enough to also be a horizontal swipe.
            this.gesture.swipedHorizontal;
            // This will always be true for a downward swipe.
            this.gesture.swipedVertical;
            LOGI('swipedown');
          });
          
          this.gesture.on('tap', (event) => {
            // The gesture was a tap. Keep in mind, it may have also been a long press.

            LOGI('tap');
        });
          
          this.gesture.on('doubletap', (event) => {
            // The gesture was a double tap. The 'tap' event will also have been fired on
            // the first tap.
            LOGI('doubletap');
          });
          
          this.gesture.on('longpress', (event) => {
            // The gesture is currently ongoing, and is now a long press.
            LOGI('longpress');
          });    

          */
    }

}
