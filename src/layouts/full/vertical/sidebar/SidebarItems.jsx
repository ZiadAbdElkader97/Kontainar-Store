import React, { useState, useContext, useMemo } from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CustomizerContext } from 'src/context/CustomizerContext';

import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const { isSidebarHover, isCollapse, isMobileSidebar, setIsMobileSidebar } =
    useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == 'mini-sidebar' && !isSidebarHover : '';

  // البحث
  const [query, setQuery] = useState('');

  const normalize = (s) => (s || '').toLowerCase().trim();

  // نفرد القايمة عشان نبحث بسهولة (نتجاهل عناصر الـ subheader في النتائج)
  const flatItems = useMemo(() => {
    const out = [];
    const walk = (nodes = []) => {
      nodes.forEach((n) => {
        if (n.title && !n.children) out.push(n);
        if (n.children && n.children.length) walk(n.children);
      });
    };
    walk(Menuitems);
    return out;
  }, []);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return flatItems.filter((item) => normalize(item.title).includes(q));
  }, [query, flatItems]);

  return (
    <Box sx={{ px: 3 }}>
      {/* شريط البحث */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search in Menu"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 0, mt: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {query ? (
        <>
          <Typography variant="caption" sx={{ px: 1, opacity: 0.7 }}>
            {results.length ? `Results (${results.length})` : 'no results'}
          </Typography>
          <List sx={{ pt: 0 }} className="sidebarNav">
            {results.map((item) => (
              <NavItem
                item={item}
                key={`search-${item.id}`}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => setIsMobileSidebar(!isMobileSidebar)}
              />
            ))}
          </List>
        </>
      ) : (
        <List sx={{ pt: 0 }} className="sidebarNav">
          {Menuitems.map((item) => {
            if (item.subheader) {
              return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
            } else if (item.children) {
              return (
                <NavCollapse
                  menu={item}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  pathWithoutLastPart={pathWithoutLastPart}
                  level={1}
                  key={item.id}
                  onClick={() => setIsMobileSidebar(!isMobileSidebar)}
                />
              );
            } else {
              return (
                <NavItem
                  item={item}
                  key={item.id}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  onClick={() => setIsMobileSidebar(!isMobileSidebar)}
                />
              );
            }
          })}
        </List>
      )}
    </Box>
  );
};
export default SidebarItems;
