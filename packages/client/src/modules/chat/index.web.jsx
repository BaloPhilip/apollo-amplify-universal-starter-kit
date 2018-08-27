import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';
import { MenuItem } from '../../modules/common/components/web';
import Test from './containers/Chat';
import resources from './locales';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/chat" className="nav-link" activeClassName="active">
    {t('chat:navLink')}
  </NavLink>
));
export default new Feature({
  route: [<Route exact path="/chat" component={Test} />],
  navItem: (
    <MenuItem key="/chat">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  localization: { ns: 'chat', resources }
});
