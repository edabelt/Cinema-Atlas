import{j as e}from"./jsx-runtime-DCCOt0jE.js";import{M as c,A as v}from"./addToFavourites-DqD2EeI-.js";import{G as d}from"./Grid-B4_Dvj7P.js";import{S as o}from"./sampleData-CvuizoMc.js";import{M as l}from"./Typography-BAgi0d9v.js";import{M as u}from"./moviesContext-DokIXCcu.js";import"./index-BeMkoiPZ.js";import"./Favorite-G0qQB9Gh.js";import"./createSvgIcon-ygxJdb4h.js";import"./StarRate-BHGffDV6.js";import"./index-BaAoURKp.js";import"./index-X6M-XfAm.js";import"./film-poster-placeholder-BHKUECkt.js";import"./Card-B2591hls.js";import"./CardContent-DgcalOlh.js";import"./Button--B3k_Vuo.js";import"./IconButton-DNk5A7jJ.js";import"./useTheme-BPCR0c-u.js";const p=({movies:i,action:t})=>i.map(s=>e.jsx(d,{item:!0,xs:12,sm:6,md:4,lg:3,xl:2,children:e.jsx(c,{movie:s,action:t},s.id)},s.id));try{movieList.displayName="movieList",movieList.__docgenInfo={description:"",displayName:"movieList",props:{movies:{defaultValue:null,description:"",name:"movies",required:!0,type:{name:"BaseMovieProps[]"}},action:{defaultValue:null,description:"",name:"action",required:!0,type:{name:"(movie: BaseMovieProps) => ReactNode"}}}}}catch{}const q={title:"Home Page/MovieList",component:p,decorators:[i=>e.jsx(l,{initialEntries:["/"],children:e.jsx(i,{})}),i=>e.jsx(u,{children:e.jsx(i,{})})]},r=()=>{const i=[{...o,id:1},{...o,id:2},{...o,id:3},{...o,id:4},{...o,id:5}];return e.jsx(d,{container:!0,spacing:5,children:e.jsx(p,{movies:i,action:t=>e.jsx(v,{...t})})})};r.storyName="Default";var n,a,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const movies = [{
    ...SampleMovie,
    id: 1
  }, {
    ...SampleMovie,
    id: 2
  }, {
    ...SampleMovie,
    id: 3
  }, {
    ...SampleMovie,
    id: 4
  }, {
    ...SampleMovie,
    id: 5
  }];
  return <Grid container spacing={5}>
      <MovieList movies={movies} action={movie => <AddToFavouritesIcon {...movie} />} />
    </Grid>;
}`,...(m=(a=r.parameters)==null?void 0:a.docs)==null?void 0:m.source}}};const F=["Basic"];export{r as Basic,F as __namedExportsOrder,q as default};
