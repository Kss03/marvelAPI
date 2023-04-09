import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null,
        loading: true,
        error: false,
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onSelectChar()
    }

    componentDidUpdate(prevProps){
        if (this.props.charId !== prevProps.charId) {
            this.onSelectChar();
        }
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false})
    }

    onCharLoading = () => {
        this.setState({loading: true})
    }

    onCharError = () => {
        this.setState({error: true})
    }

    onSelectChar() {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService.getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onCharError)
    }
    

    render() {

        const {char, loading, error} = this.state;

        const skeleton = !char ? <Skeleton /> : null;
        const spinner = (loading && !skeleton) ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage />: null;
        const view = !(loading || error) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {view}  
            </div>
        )
    }
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;

    const imgFit = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: 'unset'}: {objectFit: 'cover'};

    return(
        <>
            <div className="char__basics">
                <img style={imgFit} src={thumbnail} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There are no comics with this character"}

                {comics.map( (item, i) => {
                    // eslint-disable-next-line
                    if (i > 9) return;
                    
                    return (
                        <li className="char__comics-item" key={i}>
                            <a href={item.resourceURI}>
                                {item.name}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default CharInfo;