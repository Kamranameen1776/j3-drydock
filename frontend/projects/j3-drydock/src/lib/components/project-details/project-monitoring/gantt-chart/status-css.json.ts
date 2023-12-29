export const statusBackground = {
  RAISE: 'status-background-6',
  'IN PROGRESS': 'status-background-2',
  COMPLETE: 'status-background-3',
  REVIEW: 'status-background-4',
  APPROVE: 'status-background-5',
  VERIFY: 'status-background-1',
  CLOSE: 'status-background-7',
  CANCEL: 'status-background-19',
  NEW: 'status-background-6',
  'APPROVAL PENDING': 'status-background-6',
  APPROVED: 'status-background-3',
  REWORK: 'status-background-14'
};

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.round((R * (100 + percent)) / 100);
  G = Math.round((G * (100 + percent)) / 100);
  B = Math.round((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

export const statusProgressBarBackground = {
  VERIFY: '#103e7e',
  'IN PROGRESS': '#2676bb',
  COMPLETE: '#349258',
  REVIEW: '#7000ff',
  APPROVE: '#a35bff',
  RAISE: '#d356ff',
  NEW: '#d356ff',
  'APPROVAL PENDING': '#d356ff',
  CLOSE: '#2676BB',
  APPROVED: '#349258',
  REWORK: '#7F8594',
  CANCEL: '#DB0012'
};

export const statusProgressBarBackgroundShaded: Record<keyof typeof statusProgressBarBackground, string> = Object.keys(
  statusProgressBarBackground
).reduce((acc, key) => {
  acc[key] = shadeColor(statusProgressBarBackground[key], 10);
  return acc;
}, {}) as any;

export const statusIcon = {
  RAISE: 'status-icon-16 m-1',
  'IN PROGRESS': 'status-icon-12 m-1',
  COMPLETE: 'status-icon-13 m-1',
  REVIEW: 'status-icon-14 m-1',
  APPROVE: 'status-icon-15 m-1',
  VERIFY: 'status-icon-11 m-1',
  CLOSE: 'status-icon-17 m-1',
  CANCEL: 'status-icon-23 m-1',
  NEW: 'status-icon-16 m-1',
  'APPROVAL PENDING': 'status-icon-16 m-1',
  APPROVED: 'status-icon-13 m-1',
  REWORK: 'status-icon-18 m-1'
};
