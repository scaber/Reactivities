import ReactDOM from 'react-dom';
import React from 'react';

//open layers and styles
import * as ol from 'openlayers';
import './style.css'; 
 
class Map extends React.Component {
 
  componentDidMount() {
 
    var raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
      });
      
      var source = new ol.source.Vector();

      var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33',
            }),
          }),
        }),
      });

    // create map object with feature layer
    var map = new ol.Map({ 
      target: this.refs.mapContainer,
      layers: [raster, vector],
      view: new ol.View({
        center: [3867713.6312,4612516.0348], //Boulder
        zoom: 5,
      })
    });
    
      var modify = new ol.interaction.Modify({source: source});
      map.addInteraction(modify);

      var draw, snap; // global so we can remove them later
      var typeSelect = document.getElementById('type');
      function addInteractions() {
        draw = new ol.interaction.Draw({
          source: source,
          type: typeSelect.value,
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: source});
        map.addInteraction(snap);
      }

      typeSelect.onchange = function () {
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }; 
      addInteractions(); 
  }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    this.state.featuresLayer.setSource(
      new ol.source.Vector({
        features: this.props.routes
      })
    );
  } 
  render () {
    return (
     <div>
      <div className="map" ref="mapContainer">  </div>
      <form className="form-inline">
      <label>Geometry type &nbsp;</label>
      <select id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
      </select>
    </form>
    </div> 
    
    );
  }

}
export default Map; 