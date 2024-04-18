import {ChangeEvent, FC, memo, useState} from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    AppBar,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Pagination,
    Slider,
    TextField, Toolbar,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./homePage.css"
import {Link, useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD4gGO5URMsU-tylajiPOdGEpqCX0Yl4lM");



const cuisineTypes=['american','asian','british','caribbean','central europe','chinese','eastern europe','french','indian','italian','japanese','kosher','mediterranean','mexican','middle eastern','nordic','south american','south east asian']
    // Define an interface to describe the structure of a document returned by Solr
    interface SolrDocument {
        uri: string[];
        label: string[];
        image: string[];
        source: string[];
        url: string[];
        shareAs: string[];
        yield: number[];
        dietLabels: string[];
        healthLabels: string[];
        cautions: string[];
        ingredientLines: string[];   
        id:string;
        calories:number[];
        [key: string]: any; // Keeps the interface flexible
        "totalNutrients.FAT.quantity": number[];  // Specifically define this key as an array of numbers
        "totalNutrients.FASAT.quantity":number[];
        "totalNutrients.FATRN.quantity":number[];
        "totalNutrients.FAMS.quantity":number[];
        "totalNutrients.FAPU.quantity":number[];
    }

// Define an interface for the Solr response structure, focusing on the parts we use
interface SolrResponse {
    response: {
        numFound: number;
        start: number;
        numFoundExact: boolean;
        docs: SolrDocument[];
    };
}

interface Recipe {
    id:string
    label:string
    url:string
    ingredientLines:string[]
    calorie:number
    fat:number; 
    satfat:number;
    transfat:number;
    monsfat:number;
    posfat:number;
    healthLabel: string[]
}


const HomePage: FC<{}> = ({}) => {

    const [label, setLabel] = useState(''); //only search for recipe name
    const [checkboxState, setCheckboxState] = useState({
        checkedA: false,
        checkedB: false,
    });



    const [healthLabels, setHealthLabels] = useState([
            {id: 1, label: "vegan", checked: false},
            {id: 2, label: "vegetarian", checked: false},
            {id: 3, label: "paleo", checked: false},
            {id: 4, label: "dairy-free", checked: false},
            {id: 5, label: "gluten-free", checked: false},
            {id: 6, label: "wheat-free", checked: false},
            {id: 7, label: "fat-free", checked: false},
            {id: 8, label: "low-sugar", checked: false},
            {id: 9, label: "egg-free", checked: false},
            {id: 10, label: "peanut-free", checked: false},
            {id: 11, label: "tree-nut-free", checked: false},
            {id: 12, label: "soy-free", checked: false},
            {id: 13, label: "fish-free", checked: false},
            {id: 14, label: "shellfish-free", checked: false}
        ]
    );
    const [cuisineType, setCuisineType] = useState<string>("")
    const [calorie, setCalorie] = useState<number>(0)
    const [searchedRecipes, setSearchedRecipes]=useState<Recipe[]>([])
    const [displayedRecipes, setDisplayedRecipes]=useState<Recipe[]>([])
    const navigate = useNavigate();


    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckboxState({...checkboxState, [event.target.name]: event.target.checked});
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setCalorie(newValue as number);
    };

    const onHealthLabelChange = (healthLabelID: number) => {
        setHealthLabels(healthLabels.map(item => {
            if (item.id === healthLabelID) {
                return {...item, checked: !item.checked};
            }
            return item;
        }))

    }

    const onCuisineTypeChange=(cuisineTypeName:string)=>{

        setCuisineType(current => current === cuisineTypeName ? "" : cuisineTypeName);
    }


    const handlePaginationChange=(event:ChangeEvent<unknown> ,page:number)=>{
        setDisplayedRecipes(searchedRecipes.slice((page-1)*10, page*10))
    }

    const navigateToDetail=async (recipe:Recipe)=>{
    
        navigate(`/detail`, { state: { recipe }});
    }



const handleSubmit = async (/*healthLabel:string, cuisineType:string, calories: number, label: string*/) => {
        try {
            let solrUrl = 'http://localhost:8983/solr/Foods/';
            let queryParams = 'query?q=';
            let query = '';
            let healthLabel=healthLabels.filter((healthLabel)=>healthLabel.checked).map((healthLabel)=>healthLabel.label)
            if (label.length > 0) {
                // add AND
                query = 'label:' + label;
                queryParams = queryParams + query;
            }
            if (healthLabel.length > 0) {
                if (query.length !== 0) {
                    queryParams = queryParams + '&';
                    query = '';
                }
                for (let i = 0; i < healthLabel.length; i++) {
                    if (healthLabel.length > 0 && query.length === 0) {
                        query = 'healthLabels:' + healthLabel[i];
                    }
                    else {
                        query = query + '&healthLabels:' + healthLabel[i];
                    }
                }
                
                
                queryParams = queryParams + query;
            }
            if (cuisineType.length > 0) {
                // add AND
                if (query.length > 0) {
                    query = '&cuisineType:' + cuisineType;
                    
                }
                // does not add AND
                else {
                    query = 'cuisineType:' + cuisineType;
                }
                queryParams = queryParams + query;
            }
            if (calorie > 0) {
                let cal = calorie.toString();
                // add AND
                if (query.length > 0) {
                    query = '&fq=calories:{*%20TO%20' + cal + '}';
                    
                }
                else {
                    query = '*&fq=calories:{*%20TO%20' + cal + '}';
                }
                queryParams = queryParams + query;
            }
            if (query.length === 0) {
                queryParams = queryParams + '*';
            }
            // sort by ascending orders calories
            queryParams = queryParams + "&rows=100&sort=calories%20asc";
           
            console.log(queryParams);
     
            const response = await fetch(`${solrUrl}${queryParams}`
            , {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            console.log(response);
            
    
            if (!response.ok) {
                throw new Error(`Solr request failed: ${response.statusText}`);
            }
    
            const data: SolrResponse = await response.json();

            console.log(data.response.docs);
            

            const results:Recipe[] = data.response.docs.map((doc: SolrDocument) => ({
              id: doc.id,
              label: doc.label[0],
              url:doc.url[0],
              ingredientLines:doc.ingredientLines,
              calorie:doc.calories[0],
              healthLabel:doc.healthLabels,
              fat:doc["totalNutrients.FAT.quantity"][0],
              satfat:doc["totalNutrients.FASAT.quantity"][0],
              transfat:doc["totalNutrients.FATRN.quantity"][0],
              monsfat:doc["totalNutrients.FAMS.quantity"][0],
              posfat:doc["totalNutrients.FAPU.quantity"][0],
            }));
            
            // llm query 
            console.log(results);


           setSearchedRecipes(results);
           setDisplayedRecipes(results.slice(0,10))
        } catch (error) {
            console.log(error);
            
            console.error('Error fetching data from Solr:', error);
     
        }
    };
    

    return (
        <div className="homepage">
            <AppBar position="static" style={{height: "50px", textAlign: "center", justifyContent: 'center'}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}
                                style={{textAlign: "center", justifyContent: 'center'}}>
                        Search Recipes
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={10}>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                    <FormGroup sx={{gap:2}}>
                        {/* <FormControlLabel
                            control={<Checkbox checked={checkboxState.checkedA} onChange={handleCheckboxChange}
                                               name="checkedA"/>} label="Option A"/>
                        <FormControlLabel
                            control={<Checkbox checked={checkboxState.checkedB} onChange={handleCheckboxChange}
                                               name="checkedB"/>} label="Option B"/> */}
                        {/* health label selection */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Health Labels</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {healthLabels.map((healthLabel) => (<FormControlLabel
                                    key={healthLabel.id as unknown as string}
                                    control={
                                        <Checkbox
                                            checked={healthLabel.checked}
                                            onChange={() => onHealthLabelChange(healthLabel.id)}
                                            name={healthLabel.label}
                                        />
                                    }
                                    label={healthLabel.label}
                                />))}
                            </AccordionDetails>
                        </Accordion>
                        {/* cuisine type selection */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Cuisine Type</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {cuisineTypes.map((cuisineTypeName) => (<FormControlLabel
                                    key={uuidv4()}
                                    control={
                                        <Checkbox
                                            checked={cuisineType===cuisineTypeName}
                                            onChange={() => onCuisineTypeChange(cuisineTypeName)}
                                            name={cuisineTypeName}
                                        />
                                    }
                                    label={cuisineTypeName}
                                />))}
                            </AccordionDetails>
                        </Accordion>
                    </FormGroup>
                    <Typography>Calories: {calorie}</Typography>
                    <Slider value={calorie} onChange={handleSliderChange} aria-labelledby="input-slider" min={0} max={10000}/>
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </Grid>
                <Grid item xs={8}>
                    {displayedRecipes.map((recipe) => (
                        <Typography key={recipe.id}>
                            {/* <Link to={{pathname:`/detailPage/${recipe.id}`,state:{recipe:recipe}}} >{recipe.label}</Link> */}
                            <button onClick={()=>navigateToDetail(recipe)}>{recipe.label}</button>
                        </Typography>
                    ))}
                    <Pagination count={searchedRecipes.length/10} color="primary" onChange={handlePaginationChange}/>
                </Grid>
            </Grid>
        </div>

    );
}

export default memo(HomePage);
