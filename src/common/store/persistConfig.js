import * as localForage from 'localforage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'nordlauncher',
  version: 1.0,
  storeName: 'nordlauncher'
});

export default {
  key: 'root',
  storage: localForage,
  whitelist: ['settings', 'app'],
  stateReconciler: autoMergeLevel2
};
