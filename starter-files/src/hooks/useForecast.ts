import { useState, useEffect, ChangeEvent } from "react";
import { optionType, forecastType } from "../types";
import { log } from "console";


const useForecast = () =>{
    const [term, setTerm] = useState<string>('');
  const [options, setOptions] = useState<[]>([]);
  const [city, setCity] = useState<optionType | null>(null);
  const [forecast, setForecast] = useState<forecastType | null>(null);
  
 

  const getSearchOptions = (value: string) => {

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
    ).then(response => response.json()).then(data => setOptions(data)).catch(e => console.log(e))

    //.then(response => response.json()).then(data => console.log(data));
    // I will be able to see on the console, the 5 suggested locations in an array
  }
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setTerm(value);

    //if u are making spaces it will not trigger anything
    if (value === '') return


    getSearchOptions(value);

  }

  const getForeCast = (city: optionType) => {

   
    
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      ).then((response) => response.json())
        .then((data) => {
  
          const forecastData = {
            ...data.city,
            list: data.list.slice(0,16),
          }
          setForecast(forecastData);
          
        }).catch(e => console.log(e)
        )
    

   
  }

  const onSubmit = () => {
    if (!city) return

    getForeCast(city)
    
  }

  const onOptionSelect = (option: optionType) => {
    setCity(option)



  }

  useEffect(() => {
    if (city) {
      setTerm(city.name);
      setOptions([]);
    }
  }, [city])  

  return {
    term, 
    options, 
    forecast, 
    onInputChange, 
    onOptionSelect, 
    onSubmit
  }

}

export default useForecast