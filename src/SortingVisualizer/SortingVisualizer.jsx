import React from 'react'
import './SortingVisualizer.css'
import InsertionSort from '../SortingAlgo/InsertionSort'
import SelectionSort from '../SortingAlgo/SelectionSort'
import BubbleSort from '../SortingAlgo/BubbleSort'
import GetQuickSortAnimation from '../SortingAlgo/QuickSort.js'

const FIRST_COLOR = '#B2BABB ';
const CHANGED_COLOR = 'red';
const SECOND_COLOR = '#5DADE2';

var abort = false;

export default class SortingVisualizer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            array: [],
            changedArray: [],
            itemNumber: 100,
            delay: 10
        };
    }

    componentDidMount(){
        this.resetArray();
    }

    resetArray(){
        const array = [];
        const changedArray = [];
        for (var i = 0; i < this.state.itemNumber; i++) {
            array.push(this.RandomIntBetweenRange(5, 950));
        }
        this.setState({ array, changedArray });
        abort = false;
    }
    
    shuffleArray(){
        abort = true;
        this.resetArray();
    }

    async sortArray(sortingAlgo){
        var sortedAnimation = sortingAlgo(this.state.array);
        var array = this.state.array;
        var changedArray = this.state.changedArray;

        for (var index = 0; index < sortedAnimation.length; index++) {
            if(this.abort){
                console.log(abort);
                return null;
            }
            const [i,j] = sortedAnimation[index];

            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        
            changedArray.push(i,j);

            if(index === sortedAnimation.length - 1){
                changedArray.push(array.length + 1, array.length + 1);
                this.setState({changedArray});
            }

            this.setState({ array,changedArray });
            await sleep(this.state.delay);
        }
    }

    async selectionSort(){
        var sortedAnimation = SelectionSort(this.state.array);
        var array = this.state.array;
        var changedArray = this.state.changedArray;

        for (var index = 0; index < sortedAnimation.length; index++) {
            const [i,j, swap] = sortedAnimation[index];

            if(swap){
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        
            changedArray.push(i,j);

            if(index === sortedAnimation.length - 1){
                changedArray.push(array.length + 1, array.length + 1);
                this.setState({changedArray});
            }

            this.setState({ array, changedArray });
                
            await sleep(this.state.delay);
        }
    }

    setItemNumber(event){
        event.persist();
        this.setState({itemNumber : event.target.value}, () => {
            this.resetArray();
            console.log(event.target.value + " - " + this.state.itemNumber + " - arraySize: " + this.state.array.length);
        });
        
    }

    setdelay(event){
        this.setState({delay : event.target.value});
        
    }

    getColor(index){

        var changedArray = this.state.changedArray;

        if(changedArray.includes(index)){
            if(index === changedArray[changedArray.length - 1] || index === changedArray[changedArray.length - 2]){
                return CHANGED_COLOR;
            }
            else{
                return SECOND_COLOR;
            }
        }
        else{
            return FIRST_COLOR;
        }
        
    }


    render() {
        const {array} = this.state;
        var width = 60 / this.state.itemNumber;
        return (
            <div className="main_div" id="centerdiv">
                <div className = "title_div">
                    <img src="" alt="" />
                    <h1>Superb Sorting Visualizer</h1>

                </div>

                <div className="center_div" id="item_div">
                    {array.map((heightValue, idx) => (
                        <div className="array_item" key={idx} style={{height: `${heightValue / 25}vw`, width: `${width}vw`, backgroundColor: this.getColor(idx)}}>
                        </div>
                    ))}
                </div>

                <div className="flex_div">
                    <div className="center_div">
                        <label className="numberLabel">Size of Array:  </label>
                        <input type="range" id="vol" name="vol" min="5" max="300" onChange={(event) => this.setItemNumber(event)} defaultValue={this.state.itemNumber}/>
                    </div>
                    <div className="center_div">
                        <label className="numberLabel">Delay:  </label>
                        <input type="range" id="vol" name="vol" min="1" max="100" onChange={(event) => this.setdelay(event)} defaultValue={this.state.delay}/>           
                    </div>
                    <div className="center_div" id = "sbuttonDiv">
                        <button onClick={() => this.shuffleArray()}>Shuffle the array</button>
                    </div>
                </div>

                <div className="center_div" id="button_div">
                    <button onClick={() => this.sortArray(InsertionSort)}>Insertion Sort</button>
                    <button onClick={() => this.selectionSort()}>Selection Sort</button>
                    <button onClick={() => this.sortArray(BubbleSort)}>Bubble Sort</button>
                    <button onClick={() => this.sortArray(GetQuickSortAnimation)}>Quick Sort</button>
                </div>

                
            </ div>
        );
    }

    RandomIntBetweenRange(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}