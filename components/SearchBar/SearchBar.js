import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';

import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useRouter } from 'next/router'
import { Typography } from '@mui/material';

const Wrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '30%',
    }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    }
}));

export default function SearchBar() {
    const Router = useRouter();
    const [query, setQuery] = useState('');

    const onChange = (e) => {
        const { target: { value } } = e
        setQuery(value);
    }

    const onKeyDown = (e) => {
        const { code } = e
        
        if (code === "Enter") {
            Router.push({
                query: { search: query }
            })
            setQuery('');
        }
    }

    const onClear = () => {
        Router.push({
            query: { search: null }
        })
        setQuery('');
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Wrapper>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={query}
                />
            </Wrapper>
            {Router.query.search && <Typography sx={{ '&:hover': { cursor: 'pointer' } }} onClick={onClear}>Clear</Typography>}
        </Box>
    );
};
