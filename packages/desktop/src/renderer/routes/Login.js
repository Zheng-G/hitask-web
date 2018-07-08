import React from 'react';
import DesktopGOAuthProvider from '@hitask/components/containers/DesktopGOAuthProvider';
import LoginPage from '@hitask/components/containers/LoginPageContainer';

const LoginRoute = props => <LoginPage {...props} />;

export default DesktopGOAuthProvider(LoginRoute);
