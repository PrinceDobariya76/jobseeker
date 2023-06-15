import {SIZES} from '../theme/index';

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = size => (SIZES.width / guidelineBaseWidth) * size;
const verticalScale = size => (SIZES.height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export {horizontalScale, verticalScale, moderateScale};
