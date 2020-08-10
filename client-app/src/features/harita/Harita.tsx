import React, { FC } from 'react'
import {
    interaction, layer, custom, control, //name spaces
    Interactions, Overlays, Controls,     //group
    Map, Layers, Overlay, Util,    //objects
  } from "react-openlayers";

  import * as ol from 'openlayers';
import { observer } from 'mobx-react-lite';
  var vectorSource1= new ol.source.Cluster({
    distance: 40,
    source: new ol.source.Vector({
      url: 'https://openlayers.org/en/latest/examples/kml-earthquakes.html',
      format: new ol.format.KML({
        extractStyles: false
      })
    })
  });
	var vectorSource=new ol.layer.Tile({
    
    opacity: 1.000000,
    source: new ol.source.XYZ({
      //attributions: [new ol.control.Attribution({
      //    span: '<span><a href="http://cbs.oyak.com.tr/">Oyak CBS</a></span>'
      //})],
      url: '//mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&s=Ga',
      maxZoom: 21
    })
  });
  var tileSource = new ol.source.Stamen({
    layer: 'toner'
  });
 

  var selectCondition = function(evt:any) {
       
    return evt.originalEvent.type == 'mousemove' ||
      evt.type == 'singleclick';
  };
  var cluster = new custom.style.ClusterStyle(vectorSource);

  
  const Harita  = () => {
    return (
        <div>
          <Map view={{center: [3995516.3425,4638810.3726], zoom:5}} >
          <Interactions>
            <interaction.Select
             condition={selectCondition} 
             style={cluster.selectStyleFunction} />
          </Interactions>
          <Layers>
            <layer.Tile source={tileSource}/>
            <layer.Vector 
              source={vectorSource} 
              style={cluster.vectorStyleFunction}/>
          </Layers>
         </Map>
         <a href="https://github.com/allenhwkim/react-openlayers/blob/master/app/interactions/select.tsx">source</a>
        <pre>{`
          <Map>
            <Layers>
              <layer.Tile />
              <layer.Vector source={markers} style={markers.style} />
            </Layers>
            <Interactions>
              <interaction.Select style={selectedMarkerStyle} />
            </Interactions>
          </Map>
        `}</pre>
  
        </div>
    )
}
 export default observer(Harita);
