import { FC, useEffect, useState, memo } from "react";
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD4gGO5URMsU-tylajiPOdGEpqCX0Yl4lM");




const DetailPage: FC<{}> = ({}) => {
    let location = useLocation();
    let recipe = location.state.recipe;
    console.log(location.state.recipe);

    const navigate = useNavigate();
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        async function fetchData() {
            const lab = recipe.label;
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const query = "Please only give me history. Tell me some fun history of the recipe " + lab;
            const msg = await model.generateContent(query);
            const response = await msg.response;
            const text = await response.text();
            setResponseText(text);  // Update state with the response text
            console.log(text);  // Log text to console
        }

        fetchData();
    }, [recipe.label]); 

    return (
        <div className="homepage">
            <AppBar position="static" style={{ height: "50px", textAlign: "center", justifyContent: 'center' }}>
                <Toolbar>
                    {/* Wrap the title in a link */}
                    <a href={recipe.url} style={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h6" component="div">
                            {recipe.label}
                        </Typography>
                    </a>
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div>  {/* This div will wrap Ingredients and Calories together */}
                    <div>
                        <Typography variant="h5" component="h2" color="blue">
                            Ingredients
                        </Typography>
                        <List component="nav" aria-label="ingredients">
                            {recipe.ingredientLines.map((ingredient: string, index: number) => (
                                <ListItem key={index} button>
                                    <ListItemText primary={ingredient} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div>
                        <Typography variant="h5" component="h2" color="blue">
                            Health Labels
                        </Typography>
                        <List component="nav" aria-label="ingredients">
                            {recipe.healthLabel.map((healthLabels: string, index: number) => (
                                <ListItem key={index} button>
                                    <ListItemText primary={healthLabels} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div>  {/* Calories section under Ingredients */}
                        <Typography variant="h5" component="h2" color="blue">
                            Calories
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {recipe.calorie.toFixed(2)} kcal
                        </Typography>
                    </div>
                </div>
                <div style={{ minWidth: "300px" }}>  {/* Fat section with potential for another indented entry */}
                    <Typography variant="h5" component="h2" color="blue">
                        Total Fat:
                    </Typography>
                    <Typography variant="h6" component="h2">
                        {recipe.fat.toFixed(4)} grams
                    </Typography>
                    {/* Indented sections for detailed fat content */}
                    <div style={{ marginLeft: "20px" }}>
                        <Typography variant="h5" component="h2" color="blue">
                            Saturated Fat:
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {recipe.satfat.toFixed(4)} grams
                        </Typography>
                        <Typography variant="h5" component="h2" color="blue">
                            Trans Fat:
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {recipe.transfat.toFixed(4)} grams
                        </Typography>
                        <Typography variant="h5" component="h2" color="blue">
                            Monounsaturated Fat:
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {recipe.monsfat.toFixed(4)} grams
                        </Typography>
                        <Typography variant="h5" component="h2" color="blue">
                            Polyunsaturated Fat:
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {recipe.posfat.toFixed(4)} grams
                        </Typography>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>  {/* Fun culture and history section */}
                <Typography variant="h5" component="h2" color="blue">
                    Fun Culture and History
                </Typography>
                <Typography variant="h6" component="div" style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
                    {responseText || "Loading..."}
                </Typography>
            </div>

            <div>
                <button onClick={() => navigate(`/`)}>Back to search</button>
            </div>
        </div>
    );
}

export default memo(DetailPage);
