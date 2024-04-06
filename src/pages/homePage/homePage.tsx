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
import {Link} from "react-router-dom";

const HomePage: FC<{}> = ({}) => {

    //todo: placeholder filters and searchbar
    const [searchQuery, setSearchQuery] = useState('');
    const [checkboxState, setCheckboxState] = useState({
        checkedA: false,
        checkedB: false,
    });
    const [sliderValue, setSliderValue] = useState(30);
    const [searchResults, setSearchResults] = useState<{ id: string; title: string }[]>([]);
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

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckboxState({...checkboxState, [event.target.name]: event.target.checked});
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };

    const onHealthLabelChange = (healthLabelID: number) => {
        setHealthLabels(healthLabels.map(item => {
            if (item.id === healthLabelID) {
                return {...item, checked: !item.checked};
            }
            return item;
        }))

    }

    const handleSubmit = async () => {
        //todo: add request to Solr
        setSearchResults([
            {id: '1', title: 'Recipe 1'},
            {id: '2', title: 'Recipe 2'},
            {id: '3', title: 'Recipe 3'},
            {id: '4', title: 'Recipe 4'},
            {id: '5', title: 'Recipe 5'},
            {id: '6', title: 'Recipe 6'},
        ]);
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={checkboxState.checkedA} onChange={handleCheckboxChange}
                                               name="checkedA"/>} label="Option A"/>
                        <FormControlLabel
                            control={<Checkbox checked={checkboxState.checkedB} onChange={handleCheckboxChange}
                                               name="checkedB"/>} label="Option B"/>
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
                                    id={healthLabel.id as unknown as string}
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
                    </FormGroup>
                    <Typography>Slider Value: {sliderValue}</Typography>
                    <Slider value={sliderValue} onChange={handleSliderChange} aria-labelledby="input-slider"/>
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </Grid>
                <Grid item xs={8}>
                    {searchResults.map((result) => (
                        <Typography key={result.id}>
                            <Link to={`/detailPage/${result.id}`}>{result.title}</Link>
                            {/*<span>hello</span>*/}
                        </Typography>
                    ))}
                    <Pagination count={10} color="primary"/>
                </Grid>
            </Grid>
        </div>

    );
}

export default memo(HomePage);
