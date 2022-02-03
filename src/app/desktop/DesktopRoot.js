import { message } from 'antd';
import { push } from 'connected-react-router';
import { ipcRenderer } from 'electron';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router';
import { useDidMount } from 'rooks';
import styled from 'styled-components';
import RouteBackground from '../../common/components/RouteBackground';
import RouteWithSubRoutes from '../../common/components/RouteWithSubRoutes';
import GlobalStyles from '../../common/GlobalStyles';
import {
  checkClientToken,
  initManifests,
  initNews,
  loginThroughNativeLauncher,
  loginWithAccessToken,
  loginWithOAuthAccessToken,
  switchToFirstValidAccount,
  updateUserData
} from '../../common/reducers/actions';
import {
  load,
  received,
  requesting
} from '../../common/reducers/loading/actions';
import features from '../../common/reducers/loading/features';
import { openModal } from '../../common/reducers/modals/actions';
import ga from '../../common/utils/analytics';
import {
  ACCOUNT_MICROSOFT,
  LATEST_JAVA_VERSION
} from '../../common/utils/constants';
import { _getCurrentAccount } from '../../common/utils/selectors';
import Message from './components/Message';
import SystemNavbar from './components/SystemNavbar';
import { isLatestJavaDownloaded } from './utils';
import routes from './utils/routes';
import useTrackIdle from './utils/useTrackIdle';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Container = styled.div`
  position: absolute;
  top: ${props => props.theme.sizes.height.systemNavbar}px;
  height: calc(100vh - ${props => props.theme.sizes.height.systemNavbar}px);
  width: 100vw;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  will-change: transform;
`;

function DesktopRoot({ store }) {
  const dispatch = useDispatch();

  const currentAccount = useSelector(_getCurrentAccount);
  const clientToken = useSelector(state => state.app.clientToken);
  const javaPath = useSelector(state => state.settings.java.path);
  const javaLatestPath = useSelector(state => state.settings.java.pathLatest);
  const location = useSelector(state => state.router.location);
  const shouldShowDiscordRPC = useSelector(state => state.settings.discordRPC);

  message.config({
    top: 45,
    maxCount: 1
  });

  const init = async () => {
    dispatch(requesting(features.mcAuthentication));
    const userDataStatic = await ipcRenderer.invoke('getUserData');
    const userData = dispatch(updateUserData(userDataStatic));
    await dispatch(checkClientToken());
    dispatch(initNews());

    const manifests = await dispatch(initManifests());

    let isJava8OK = javaPath;
    let isJavaLatestOk = javaLatestPath;

    if (!javaPath) {
      ({ isValid: isJava8OK } = await isLatestJavaDownloaded(
        manifests,
        userData,
        true
      ));
    }

    if (!isJavaLatestOk) {
      ({ isValid: isJavaLatestOk } = await isLatestJavaDownloaded(
        manifests,
        userData,
        true,
        LATEST_JAVA_VERSION
      ));
    }

    if (!isJava8OK || !isJavaLatestOk) {
      dispatch(openModal('JavaSetup', { preventClose: true }));

      // Super duper hacky solution to await the modal to be closed...
      // Please forgive me
      await new Promise(resolve => {
        function checkModalStillOpen(state) {
          return state.modals.find(v => v.modalType === 'JavaSetup');
        }

        let currentValue;
        const unsubscribe = store.subscribe(() => {
          const previousValue = currentValue;
          currentValue = store.getState().modals.length;
          if (previousValue !== currentValue) {
            const stillOpen = checkModalStillOpen(store.getState());

            if (!stillOpen) {
              unsubscribe();
              return resolve();
            }
          }
        });
      });
    }

    if (process.env.NODE_ENV === 'development' && currentAccount) {
      dispatch(received(features.mcAuthentication));
      dispatch(push('/home'));
    } else if (currentAccount) {
      dispatch(
        load(
          features.mcAuthentication,
          dispatch(
            currentAccount.accountType === ACCOUNT_MICROSOFT
              ? loginWithOAuthAccessToken()
              : loginWithAccessToken()
          )
        )
      ).catch(() => {
        dispatch(switchToFirstValidAccount());
      });
    } else {
      dispatch(
        load(features.mcAuthentication, dispatch(loginThroughNativeLauncher()))
      ).catch(console.error);
    }

    if (shouldShowDiscordRPC) {
      ipcRenderer.invoke('init-discord-rpc');
    }

    ipcRenderer.on('custom-protocol-event', (e, data) => {
      console.log(data);
    });
  };

  // Handle already logged in account redirect
  useDidMount(init);

  useEffect(() => {
    if (!currentAccount) {
      dispatch(push('/'));
    }
  }, [currentAccount]);

  useEffect(() => {
    if (clientToken && process.env.NODE_ENV !== 'development') {
      ga.setUserId(clientToken);
      ga.trackPage(location.pathname);
    }
  }, [location.pathname, clientToken]);

  useTrackIdle(location.pathname);

  return (
    <Wrapper>
      <SystemNavbar />
      <Message />
      <Container>
        <GlobalStyles />
        <RouteBackground />
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} /> // eslint-disable-line
          ))}
        </Switch>
      </Container>
    </Wrapper>
  );
}

export default memo(DesktopRoot);
