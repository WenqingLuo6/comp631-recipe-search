import {FC, memo} from "react";
import { useLocation } from 'react-router-dom';
import {AppBar, Toolbar, Typography, List, ListItem, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";



const DetailPage:FC<{}> = ({})=> {
    let location=useLocation();
    let recipe=location.state.recipe
    console.log(location.state.recipe);

    const navigate = useNavigate();
    
    return (        
    <div className="homepage">
        <AppBar position="static" style={{height: "50px", textAlign: "center", justifyContent: 'center'}}>
            <Toolbar>
                {/* <a href={recipe.url}> */}
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}
                        style={{textAlign: "center", justifyContent: 'center'}}>
                        {recipe.label}
                    </Typography>
                    <a href={recipe.url}>link</a>
                {/* </a> */}
            </Toolbar>
        </AppBar>
        <div>
            <Typography variant="h5" component="h2" color="blue">
                Ingredients
            </Typography>
            <List component="nav" aria-label="ingredients">
                {recipe.ingredientLines.map((ingredient:string, index:number) => (
                <ListItem key={index} button>
                    <ListItemText primary={ingredient} />
                </ListItem>
                ))}
            </List>
        </div>
        <div>
            <Typography variant="h5" component="h2" color="blue">
                Calorie
            </Typography>
            <Typography variant="h6" component="h2">
                {recipe.calorie.toFixed(2)} kcal
            </Typography>
        </div>
    </div>);
}

export default memo(DetailPage);
