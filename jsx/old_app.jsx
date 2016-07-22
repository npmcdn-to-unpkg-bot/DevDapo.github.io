var stateDB = {}

var sort_abilities = function(a,b) {
  if (a.slot < b.slot)
    return -1;
  if (a.slot > b.slot)
    return 1;
  return 0;
}
var get_gender_rate = function(rate) {
  switch(rate) {
    case -1:
      return (
        <div>
          <label className="gender genderless">Genderless</label>
        </div>)
      break;
    case 0:
      return (
        <div>
          <label className="gender male">&#9794; 100.0%</label>
        </div>)
      break;
    case 1:
      return (
        <div>
          <label className="gender male">&#9794; 87.5%</label>
          <br />
          <label className="gender female">&#9792; 12.5%</label>
        </div>)
      break;
    case 2:
      return (
        <div>
          <label className="gender male">&#9794; 75.0%</label>
          <br />
          <label className="gender female">&#9792; 25.0%</label>
        </div>)
      break;
    case 4:
      return (
        <div>
          <label className="gender male">&#9794; 50.0%</label>
          <br />
          <label className="gender female">&#9792; 50.0%</label>
        </div>)
      break;
    case 8:
      return (
        <div>
          <label className="gender female">&#9792; 100.0%</label>
        </div>)
      break;
    default:
      return 'Not found'
  }
}

var Navigation = React.createClass({
  render: function() {
      return (
        <div className="row">
          <div className="col-lg-12">
            <nav className="navbar navbar-inverse">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <ReactRouter.IndexLink to="/" className="navbar-brand">DapoDex</ReactRouter.IndexLink>
                </div>

                <div className="collapse navbar-collapse" id="navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li><ReactRouter.Link to="/pokemon/" activeClassName="active">Pokemon</ReactRouter.Link></li>
                    <li><ReactRouter.Link to="/mhg/" activeClassName="active">Monster Hunter</ReactRouter.Link></li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      );
    }
});

var Loading = React.createClass({
  render: function() {
    return (
      <div className="col-xs-12">
          <center><label>Fetching some data, please be patient...</label></center>
          <div className="loader">Loading...</div>
      </div>)
  }
});

var PokemonOverview = React.createClass({
  getInitialState: function() {
      return {
        pokedex: stateDB.pokedex
      }
  },

  componentDidMount: function(){
  },

  render: function() {
    return (
      <div>
        <h2>Pokemon</h2>
        {this.state.pokedex.pokemon.map(function(pokemon) {
          return (
            <ReactRouter.Link to={'/pokemon/'+pokemon.entry_number+'/'} key={'overview_pokemon_' + pokemon.entry_number}>
              <div className="col-xs-3 col-lg-2">
                <center>
                  <img className="pokemon_sprite" src={'http://pokeapi.co/media/sprites/pokemon/' + pokemon.entry_number + '.png'} />
                </center>
                <div className="center">#{pokemon.entry_number}</div>
                <div className="center capitalize">{pokemon.pokemon_species.name}</div>
              </div>
            </ReactRouter.Link>
          )
        })}
      </div>
    );
  }
});

var Pokemon = React.createClass({
  getInitialState: function() {
    var pokeid = this.props.params.pokemon_id;
      return {
        pokeid: pokeid,
        pokemon: stateDB.pokemon[pokeid].pokemon,
        species: stateDB.pokemon[pokeid].species,
      }
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      pokeid: newProps.params.pokemon_id,
      pokemon: stateDB.pokemon[pokeid].pokemon,
      species: stateDB.pokemon[pokeid].species,
    });
  },
  render: function() {
    var previous = (<div className="col-xs-6"></div>);
    var next = (<div className="col-xs-6"></div>);
    var previousID = parseInt(this.state.pokeid)-1;
    var nextID = parseInt(this.state.pokeid)+1;

    if(previousID > 0) {
      previous = (
        <ReactRouter.Link to={'/pokemon/'+previousID+'/'}>
          <label>#{previousID}</label>
        </ReactRouter.Link>
      )
    }
    if(nextID < stateDB.pokedex.pokemon.length) {
      next = (
        <ReactRouter.Link to={'/pokemon/'+nextID+'/'}>
          <label>#{nextID}</label>
        </ReactRouter.Link>
      )
    }
    if (this.state.pokemon && this.state.species) {
      return (
        <div className="row">
          <div className="col-xs-12">
            {previous}
            {next}
          </div>
          <PokemonInfo species={this.state.species} pokemon={this.state.pokemon} />
        </div>
      )
    } else {
      return (<Loading />)
    }
  }
});
var PokemonInfo = React.createClass({
  render: function() {
    return (
      <div className="col-xs-12 col-lg-4">
        <div className="row">
          <div className="col-xs-12">
            <center>
              <h3 className="capitalize">{this.props.species.name}</h3>
            </center>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3">
            <small>Japanese</small>
            <div>
              <label className="capitalize">
                {this.props.species.names.map(function(name) {
                  if (name.language.name == 'ja') {
                    return name.name;
                  }
                })}
              </label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Roomaji</small>
            <div>
              <label className="capitalize">
                {this.props.species.names.map(function(name) {
                  if (name.language.name == 'roomaji') {
                    return name.name;
                  }
                })}
              </label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Genus</small>
            <div>
              <label className="capitalize">
                {this.props.species.genera.map(function(genus) {
                  if (genus.language.name == 'en') {
                    return genus.genus;
                  }
                })}
              </label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>National Pokedex</small>
            <div>
              <label className="capitalize">#{this.props.species.id}</label>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="col-xs-6">
              <div>
                <img src={this.props.pokemon.sprites.front_default}></img>
                <img src={this.props.pokemon.sprites.back_default}></img>
              </div>
            </div>
            <div className="col-xs-6">
              <div>
                <img src={this.props.pokemon.sprites.front_shiny}></img>
                <img src={this.props.pokemon.sprites.back_shiny}></img>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3">
            <small>Type(s)</small>
            <div className="capitalize">
              {this.props.pokemon.types.map(function(type) {
                return (<label className={'type '+type.type.name}>{type.type.name} &nbsp;</label>)
              })}
            </div>
          </div>

          <div className="col-xs-3">
            <small>Abilities</small>
            <div className="capitalize">
              <label>
                {this.props.pokemon.abilities.sort(sort_abilities).map(function(ability) {
                  return (
                    <div style={ability.is_hidden ? {color: 'grey'} : {}}>{ability.ability.name}</div>
                  )
                })}
              </label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Body Style</small>
            <div className="capitalize">
              <label>{this.props.species.shape.name}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Habitat</small>
            <div className="capitalize">
              <label>{this.props.species.habitat.name}</label>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-xs-3">
            <small>Egg Group</small>
            <div className="capitalize">
              {this.props.species.egg_groups.map(function(eggGroup){
                  return (<label>{eggGroup.name} &nbsp;</label>)
                })}
            </div>
          </div>

          <div className="col-xs-3">
            <small>Gender Ratio</small>
            <div className="capitalize">
              {get_gender_rate(this.props.species.gender_rate)}
            </div>
          </div>

          <div className="col-xs-3">
            <small>Hatch Steps</small>
            <div className="capitalize">
              <label>{this.props.species.hatch_counter * 250}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Catch Rate</small>
            <div className="capitalize">
              <label>{this.props.species.capture_rate}</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3">
            <small>Height</small>
            <div className="capitalize">
              <label>{this.props.pokemon.height}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Weight</small>
            <div className="capitalize">
              <label>{this.props.pokemon.weight}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Base XP</small>
            <div className="capitalize">
              <label>{this.props.pokemon.base_experience}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Lvl Rate</small>
            <div className="capitalize">
              <label>{this.props.species.growth_rate.name}</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3">
            <small>Is Baby</small>
            <div className="capitalize">
              <label>{this.props.species.is_baby ? 'True' : 'False'}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>EV Yield</small>
            <div className="capitalize">
              <label></label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Base Friendship</small>
            <div className="capitalize">
              <label>{this.props.species.base_happiness}</label>
            </div>
          </div>

          <div className="col-xs-3">
            <small>Pokedex Color</small>
            <div className="capitalize">
              <label style={{color: this.props.species.color.name}}>{this.props.species.color.name}</label>
            </div>
          </div>
        </div>
        <div className="row">
        </div>
      </div>
    )
  }
});

var PokemonAbility = React.createClass({
  render: function() {
    return (<div>Ability</div>)
  }
});

var PokemonForm = React.createClass({
  render: function() {
    return (<div>Form</div>)
  }
});

var PokemonGame = React.createClass({
  render: function() {
    return (<div>Game</div>)
  }
});

var PokemonMove = React.createClass({
  render: function() {
    return (<div>Moves</div>)
  }
});

var PokemonType = React.createClass({
  render: function() {
    return (<div>Type</div>)
  }
});

var Home = React.createClass({
  render: function() {
      return (
        <div>
          <h2>HELLO</h2>
          <p>Cras facilisis urna ornare ex volutpat, et
          convallis erat elementum. Ut aliquam, ipsum vitae
          gravida suscipit, metus dui bibendum est, eget rhoncus nibh
          metus nec massa. Maecenas hendrerit laoreet augue
          nec molestie. Cum sociis natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus.</p>

          <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
        </div>
      );
    }
});

var MHG = React.createClass({
  render: function() {
      return (
        <div>
          <h2>Monster Hunter Generations</h2>
        </div>
      );
    }
});

var App = React.createClass({
  componentDidMount: function(){
    initializeData();
    setTimeout(this.checkData, 1000);
  },
  checkData: function() {
    if (stateDB.pokedex) {
      this.forceUpdate();
    } else {
      setTimeout(this.checkData, 1000);
    }
  },
  render: function() {
    var content = (<Loading />)
    if (stateDB.pokedex) {
      content = this.props.children
    }
    return (
      <div>
        <Navigation/>
        <div className="container">
          {content}
        </div>
      </div>
    )
  }
});

ReactDOM.render(
  <ReactRouter.Router>
    <ReactRouter.Route path="/" component={App}>
      <ReactRouter.IndexRoute component={Home}/>
      <ReactRouter.Route path="pokemon/">
        <ReactRouter.IndexRoute component={PokemonOverview}/>
        <ReactRouter.Route path=":pokemon_id/" component={Pokemon} />
      </ReactRouter.Route>
      <ReactRouter.Route path="mhg" component={MHG} />
    </ReactRouter.Route>
  </ReactRouter.Router>,
  document.querySelector("#container")
);
