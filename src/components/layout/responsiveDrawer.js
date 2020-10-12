import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/icons/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));


function ResponsiveDrawer(props) {
    const { window, children, location: {pathname}  } = props;
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
          <Hidden xsDown>
            <div className={classes.toolbar} />
          </Hidden>
          <MenuList>
            <MenuItem component={Link} to="/" selected={'/' === pathname}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary='Home' />
            </MenuItem>
            <MenuItem component={Link} to="/search" selected={'/search' === pathname}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary='Search' />
            </MenuItem>
          </MenuList>
        </div>
    );
    
    const container = window !== undefined ? () => window().document.body : undefined;
    

    return (
      <Fragment>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  className={classes.menuButton}
              >
                  <Menu />
              </IconButton>
              <Typography variant="h6" noWrap>
                  Movie Central
              </Typography>
              </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="navigation">
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Hidden smUp implementation="css">
              <Drawer
                  container={container}
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  classes={{
                      paper: classes.drawerPaper,
                  }}
                  ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                  }}
              >
                  {drawer}
              </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css">
              <Drawer
                  classes={{
                      paper: classes.drawerPaper,
                  }}
                  variant="permanent"
                  open
              >
                  {drawer}
              </Drawer>
              </Hidden>
          </nav>
          <main className={classes.content}>
              <div className={classes.toolbar} />
              {children}
          </main>
        </div>
      </Fragment>
    );
}

export default withRouter(ResponsiveDrawer);