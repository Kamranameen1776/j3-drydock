import { IJbDialog } from 'jibe-components';

export function getSmallPopup(): IJbDialog {
  return {
    dialogWidth: 480,
    closableIcon: true,
    resizableDialog: false,
    focusOnShow: false
  };
}
