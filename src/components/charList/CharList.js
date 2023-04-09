import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

import './charList.scss';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        newItemLoading: false,
        error: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onCharRequest()
    }

    onCharRequest = async (offset) => {
        this.onCharLoading();
        return await this.marvelService.getAllCharacters(offset)
            .then(this.onCharlistLoaded)
            .catch(this.onCharlistError)
    }

    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharlistLoaded = (newChars) => {

        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onMoreChars = async(offset) => {
        await this.onCharRequest(offset);
    }

    onCharlistError = () => {
        this.setState({
            error: true, 
            loading: false
        })
    }

    renderItems(arr) {
        const charArr = arr.map( (char) => {
            const {name, id, thumbnail} = char;
            const imgFit = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: 'unset'}: {objectFit: 'cover'};

            return (
                <li 
                className="char__item" 
                key={id} 
                onClick={() => this.props.onSelected(id)}>
                    <img src={thumbnail} alt={name} style={imgFit}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
    
        return(
            <ul className="char__grid">
                {charArr}
            </ul>
        )
    }
        
    render() {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? this.renderItems(chars) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long" 
                    onClick={() => this.onMoreChars(offset)}
                    disabled={newItemLoading}
                    style={{
                        'display': (charEnded ? 'none' : 'block')
                    }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;