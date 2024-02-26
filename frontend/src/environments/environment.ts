// eslint-disable-next-line dot-notation
export const environment = (window['environment'] = {
  production: false,
  masterAPI: `https://j3-dev.jibe.solutions/api/master/`,
  infraAPI: `https://j3-dev.jibe.solutions/api/infra/`,
  operationsAPI: `https://j3-dev.jibe.solutions/api/operation/`,
  crewAPI: `https://j3-dev.jibe.solutions/api/crew/`,
  technicalAPI: `https://j3-dev.jibe.solutions/api/technical/`,
  j3TaskManagerAPI: `https://j3-dev.jibe.solutions/api/j3-task-manager/`,
  accountingAPI: `https://j3-dev.jibe.solutions/api/accounting/`,
  j3PrcCatalogAPI: `https://j3-dev.jibe.solutions/api/j3-prc-catalog/`,
  j3ProcurementAPI: `https://j3-dev.jibe.solutions/api/j3-procurement/`,
  emailAPI: `https://j3-dev.jibe.solutions/api/email/`,
  j1URL: 'http://13.127.43.17/JiBeDev/Account/login.aspx?J1Token',
  ocaURL: 'http://13.127.43.17/DEVOCA/',
  origin: `${window.location.origin}/`, // to get form structure and form values json files from assets this property is requrired.
  env: 'dev',
  jcdsAPI: 'https://jcds-test.jibe.solutions/api/',
  j3CrewAccountsAPI: `http://localhost:3003/`,
  dryDockAPI: `http://localhost:3034/`, // If you working with new feature update on localhost
  j2: {
    baseURL: 'http://13.127.79.131/JiBe/'
  },
  jibe_user: 'akshayb',
  jibe_password: '123456'
});
