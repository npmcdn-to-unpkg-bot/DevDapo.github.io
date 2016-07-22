var stateDB = null;
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
                <ReactRouter.IndexLink to="/" className="navbar-brand">DapoDex v0.1</ReactRouter.IndexLink>
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

var PokemonApp = React.createClass({
  render: function() {
    return (<div>
      {this.props.children}
    </div>)
  }
});
var PokemonList = React.createClass({
  getInitialState: function() {
    return {
      pokedex: stateDB.pokemon_species
    }
  },
  componentDidMount: function() {
  },
  render: function() {
    return (
      <div>
        <h2>Pokemon</h2>
        {this.state.pokedex.map(function(pokemon) {
          return (
            <ReactRouter.Link to={'/pokemon/'+pokemon.pokedex_number+'/'} key={'overview_pokemon_' + pokemon.pokedex_number}>
              <div className="col-xs-3 col-lg-2">
                <center>
                  <img className="pokemon_sprite" src={'icons/sprites/default/' + pokemon.pokedex_number + '_front.png'} />
                </center>
                <div className="center">#{pokemon.pokedex_number}</div>
                <div className="center capitalize">{pokemon.name}</div>
              </div>
            </ReactRouter.Link>
          )
        })}
      </div>)
  }
});
var PokemonNavigator = React.createClass({
  render: function() {
    var previousID = parseInt(this.props.pokeid) - 1;
    var nextID = parseInt(this.props.pokeid) + 1;
    var previous = '';
    var next = '';
    if (previousID > 0) {
      previous = (
        <ReactRouter.Link to={'/pokemon/'+previousID+'/'} className="pokemon_nav btn btn-default btn-lg btn-block">
          <img className="pokemon_sprite" src={'icons/sprites/default/' + previousID + '_front.png'} />
          <label className="capitalize">#{previousID} {stateDB.pokemon_species[previousID-1].name}</label>
        </ReactRouter.Link>
      )
    }
    if (nextID <= 721) {
      next = (
        <ReactRouter.Link to={'/pokemon/'+nextID+'/'} className="pokemon_nav btn btn-default btn-lg btn-block">
          <label className="capitalize">#{nextID} {stateDB.pokemon_species[nextID-1].name}</label>
          <img className="pokemon_sprite" src={'icons/sprites/default/' + nextID + '_front.png'} />
        </ReactRouter.Link>
      )
    }
    return (
      <div className="col-xs-12">
        <div className="col-xs-6">
          {previous}
        </div>
        <div className="col-xs-6">
          {next}

        </div>
      </div>
    )
  }
});
var PokemonInfo = React.createClass({
  getInitialState: function() {
    return {
      pokeid: null,
      found: false
    }
  },
  getData: function() {
    var _this = this;
    $.getJSON('json/pokemon/'+this.state.pokeid+'.json', function(data) {
      _this.setState({data: data, found: true});
    });
  },
  componentWillReceiveProps: function(newProps) {
    this.state.pokeid = newProps.params.pokeid;
    this.getData();
  },
  componentDidMount() {
    this.state.pokeid = this.props.params.pokeid;
    this.getData();
  },
  render: function() {
    if (this.state.data) {
      return (
        <div>
          <PokemonNavigator pokeid={this.state.pokeid} />
          <PokemonData species={this.state.data.species} pokemon={this.state.data.pokemon} />
        </div>
      )
    } else if (this.state.found) {
      return (<div>Sorry, no pokemon found...</div>)
    } else {
      return (<Loading />)
    }
  }
});
var PokemonData = React.createClass({
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
                <img src={'icons/sprites/default/' + this.props.species.id + '_front.png'}></img>
                <img src={'icons/sprites/default/' + this.props.species.id + '_back.png'}></img>
              </div>
            </div>
            <div className="col-xs-6">
              <div>
                <img src={'icons/sprites/shiny/' + this.props.species.id + '_front.png'}></img>
                <img src={'icons/sprites/shiny/' + this.props.species.id + '_back.png'}></img>
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
var Home = React.createClass({
  render: function() {
    return (<div>Home</div>)
  }
});

var App = React.createClass({
  loadData: function() {
    var _this = this;
    $.getJSON('json/pokedex.json', function(data) {
      stateDB = data;
      _this.forceUpdate();
    });
  },
  componentDidMount: function() {
    this.loadData();
  },
  render: function() {
    if(stateDB) {
      return (
        <div>
          <Navigation />
          <div className="container">
            {this.props.children}
          </div>
        </div>)
    } else {
      return (<Loading />)
    }
  }
});

ReactDOM.render(
  <ReactRouter.Router>
    <ReactRouter.Route path="/" component={App}>
      <ReactRouter.IndexRoute component={Home} />
      <ReactRouter.Route path="pokemon/" component={PokemonApp}>
        <ReactRouter.IndexRoute component={PokemonList} />
        <ReactRouter.Route path=":pokeid/" component={PokemonInfo} />
      </ReactRouter.Route>
    </ReactRouter.Route>
  </ReactRouter.Router>,
  document.querySelector("#container")
);

// <ReactRouter.Route path="/" component={App}>
//   <ReactRouter.IndexRoute component={Home}/>
//   <ReactRouter.Route path="pokemon/">
//     <ReactRouter.IndexRoute component={PokemonOverview}/>
//     <ReactRouter.Route path=":pokemon_id/" component={Pokemon} />
//   </ReactRouter.Route>
//   <ReactRouter.Route path="mhg" component={MHG} />
// </ReactRouter.Route>
