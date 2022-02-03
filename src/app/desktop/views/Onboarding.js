import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { push } from 'connected-react-router';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { _getCurrentAccount } from '../../../common/utils/selectors';

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.palette.colors.darkBlue};
  overflow: hidden;
`;

const Home = () => {
  const dispatch = useDispatch();
  const account = useSelector(_getCurrentAccount);

  return (
    <Background>
      <div
        css={`
          height: 100%;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={`
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            padding: 0 120px;
          `}
        >
          {account.selectedProfile.name}, welcome to NordLauncher, a fork of
          GDLauncher with some UI Improvements in the theme of{' '}
          <a href="https://nordtheme.com">The Nord Theme</a>!
        </div>
      </div>

      <div
        css={`
          position: fixed;
          right: 20px;
          bottom: 20px;
          transition: 0.1s ease-in-out;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          font-size: 40px;
          cursor: pointer;
          width: 70px;
          height: 40px;
          color: ${props => props.theme.palette.text.icon};
          &:hover {
            background: ${props => props.theme.action.hover};
          }
        `}
        onClick={() => dispatch(push('/home'))}
      >
        <FontAwesomeIcon icon={faLongArrowAltRight} />
      </div>
    </Background>
  );
};

export default memo(Home);
