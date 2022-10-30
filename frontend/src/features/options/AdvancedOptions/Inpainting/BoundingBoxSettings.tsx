import { Flex } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ChangeEvent } from 'react';
import { BiReset } from 'react-icons/bi';

import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../app/store';
import IAICheckbox from '../../../../common/components/IAICheckbox';
import IAIIconButton from '../../../../common/components/IAIIconButton';

import IAINumberInput from '../../../../common/components/IAINumberInput';
import IAISlider from '../../../../common/components/IAISlider';
import IAISwitch from '../../../../common/components/IAISwitch';
import { roundDownToMultiple } from '../../../../common/util/roundDownToMultiple';
import {
  InpaintingState,
  setBoundingBoxDimensions,
  setShouldLockBoundingBox,
  setShouldShowBoundingBox,
  setShouldShowBoundingBoxFill,
} from '../../../tabs/Inpainting/inpaintingSlice';

const boundingBoxDimensionsSelector = createSelector(
  (state: RootState) => state.inpainting,
  (inpainting: InpaintingState) => {
    const {
      canvasDimensions,
      boundingBoxDimensions,
      shouldShowBoundingBox,
      shouldShowBoundingBoxFill,
      pastLines,
      futureLines,
      shouldLockBoundingBox,
    } = inpainting;
    return {
      canvasDimensions,
      boundingBoxDimensions,
      shouldShowBoundingBox,
      shouldShowBoundingBoxFill,
      pastLines,
      futureLines,
      shouldLockBoundingBox,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);

const BoundingBoxSettings = () => {
  const dispatch = useAppDispatch();
  const {
    canvasDimensions,
    boundingBoxDimensions,
    shouldShowBoundingBox,
    shouldShowBoundingBoxFill,
    shouldLockBoundingBox,
  } = useAppSelector(boundingBoxDimensionsSelector);

  const handleChangeBoundingBoxWidth = (v: number) => {
    dispatch(setBoundingBoxDimensions({ ...boundingBoxDimensions, width: Math.floor(v) }));
  };

  const handleChangeBoundingBoxHeight = (v: number) => {
    dispatch(setBoundingBoxDimensions({ ...boundingBoxDimensions, height: Math.floor(v) }));
  };

  const handleShowBoundingBox = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(setShouldShowBoundingBox(e.target.checked));

  const handleChangeShouldShowBoundingBoxFill = () => {
    dispatch(setShouldShowBoundingBoxFill(!shouldShowBoundingBoxFill));
  };

  const handleChangeShouldLockBoundingBox = () => {
    dispatch(setShouldLockBoundingBox(!shouldLockBoundingBox));
  };

  const handleResetWidth = () => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        width: Math.floor(canvasDimensions.width),
      })
    );
  };

  const handleResetHeight = () => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        height: Math.floor(canvasDimensions.height),
      })
    );
  };

  return (
    <div className="inpainting-bounding-box-settings">
      <div className="inpainting-bounding-box-header">
        <p>Inpaint Box</p>
        <IAISwitch
          isChecked={shouldShowBoundingBox}
          width={'auto'}
          onChange={handleShowBoundingBox}
        />
      </div>
      <div className="inpainting-bounding-box-settings-items">
        <div className="inpainting-bounding-box-dimensions-slider-numberinput">
          <IAISlider
            label="Box W"
            min={64}
            max={roundDownToMultiple(canvasDimensions.width, 64)}
            step={64}
            value={boundingBoxDimensions.width}
            onChange={handleChangeBoundingBoxWidth}
            isDisabled={!shouldShowBoundingBox}
            width={'5rem'}
          />
          <IAINumberInput
            value={boundingBoxDimensions.width}
            onChange={handleChangeBoundingBoxWidth}
            min={64}
            max={roundDownToMultiple(canvasDimensions.width, 64)}
            step={64}
            isDisabled={!shouldShowBoundingBox}
            width={'5rem'}
          />
          <IAIIconButton
            size={'sm'}
            aria-label={'Reset Width'}
            tooltip={'Reset Width'}
            onClick={handleResetWidth}
            icon={<BiReset />}
            styleClass="inpainting-bounding-box-reset-icon-btn"
            isDisabled={
              !shouldShowBoundingBox ||
              canvasDimensions.width === boundingBoxDimensions.width
            }
          />
        </div>
        <div className="inpainting-bounding-box-dimensions-slider-numberinput">
          <IAISlider
            label="Box H"
            min={64}
            max={roundDownToMultiple(canvasDimensions.height, 64)}
            step={64}
            value={boundingBoxDimensions.height}
            onChange={handleChangeBoundingBoxHeight}
            isDisabled={!shouldShowBoundingBox}
            width={'5rem'}
          />
          <IAINumberInput
            value={boundingBoxDimensions.height}
            onChange={handleChangeBoundingBoxHeight}
            min={64}
            max={roundDownToMultiple(canvasDimensions.height, 64)}
            step={64}
            padding="0"
            isDisabled={!shouldShowBoundingBox}
            width={'5rem'}
          />
          <IAIIconButton
            size={'sm'}
            aria-label={'Reset Height'}
            tooltip={'Reset Height'}
            onClick={handleResetHeight}
            icon={<BiReset />}
            styleClass="inpainting-bounding-box-reset-icon-btn"
            isDisabled={
              !shouldShowBoundingBox ||
              canvasDimensions.height === boundingBoxDimensions.height
            }
          />
        </div>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <IAICheckbox
            label="Darken Outside Box"
            isChecked={shouldShowBoundingBoxFill}
            onChange={handleChangeShouldShowBoundingBoxFill}
            styleClass="inpainting-bounding-box-darken"
            isDisabled={!shouldShowBoundingBox}
          />
          <IAICheckbox
            label="Lock Bounding Box"
            isChecked={shouldLockBoundingBox}
            onChange={handleChangeShouldLockBoundingBox}
            styleClass="inpainting-bounding-box-darken"
            isDisabled={!shouldShowBoundingBox}
          />
        </Flex>
      </div>
    </div>
  );
};

export default BoundingBoxSettings;
