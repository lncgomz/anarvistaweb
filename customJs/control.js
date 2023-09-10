function retrieveLinks() {
  fetch("../links.json")
    .then((response) => response.json())
    .then((json) => {
      document.getElementById("links").value = json;
    });
}

AFRAME.registerComponent('scenecontroller', {
  // tick: function (time, timeDelta) {
    
  //   var vid = document.querySelectorAll('video')
  //   if (vid.length > 0) {
  //     var spn = document.getElementsByClassName('spinnerContainer')[0]
  //     var cam = document.getElementsByClassName('scene')[0]
  //     var rg = document.getElementsByClassName('rightGroup')[0]
  //     if (spn) {
  //       spn.setAttribute('style', 'display: none')
  //       cam.removeAttribute('hidden')
  //       rg.removeAttribute('hidden')
  //       let info = document.getElementsByClassName('infoFooter')[0]
  //       info.innerHTML = 'Escanea el marcador AR con la cámara'
  //     }      
      
  //   } else {
  //     var spn = document.getElementsByClassName('spinnerContainer')[0]
  //     if (spn) {
  //       spn.setAttribute('style', 'display: flex')
  //     }      
  //   }
  // },
})

AFRAME.registerComponent('registerevents', {
  init: function () {
    let marker = this.el
    let sounds = Array.prototype.slice.call(
      document.querySelectorAll('[sound]'),
    )
    let entities = Array.prototype.slice.call(
      document.querySelectorAll('a-entity'),
    )
    let models = Array.prototype.slice.call(
      document.querySelectorAll('a-asset-item'),
    )
    let names = {
      escasez: 'Escasez Punk Rock',
      dw: 'Detective Wadd',
      procesx: 'Procesx Punk Medallo',
      sotano: 'El Sótano Fanzine',
      agente: 'Agente Extraño',
      coprofagia: 'Coprofagia',
      fango: 'Fango',
      proxtatikoz: 'Proxtatikoz',
      som: 'Solución o Muerte TPHC',
      mayoria: 'Mayoría Equivocada',
      desquiciadamente: 'Desquiciada-Mente',
      anarvista: 'AnARvista',
      med: 'Mentes en Disturbio',
      caminata: 'Caminatas Punk',
      odio: 'O.D.I.O.',
      perrera: 'La Perrera',
    }

    let songs = {
      escasez: 'Escasez Punk Rock - Sin Parar',
      dw: 'Detective Wadd - Banda de Hampones',
      procesx: 'Procesx Punk Medallo - Tierra de los Sapos',
      sotano: 'Portatu - Skulls',
      agente: 'Agente Extraño - Inanición',
      coprofagia: 'Coprofagia - Brutal Demencia',
      fango: 'Fango - Niño Pijo',
      proxtatikoz: 'Proxtatikoz - Tacto Rectal',
      som: 'Solución o Muerte TPHC - Tombos HP',
      mayoria: 'Autopsia - Mayoría Equivocada',
      desquiciadamente: 'HoliznaCC0 - Punk',
      anarvista: '@Patia No - Hazlo Tu Mismo',
      med: 'AudioDisturbio - Mentes en Disturbio',
      caminata: 'Portatu - Skulls',
      odio: 'O.D.I.O. - Los Nadie',
      perrera: 'La Perrera - La Perrera',
    }

    marker.addEventListener('markerFound', function () {
      const entityTag = `#${marker.id}`
      let cmd = document.getElementsByClassName('command')[0];
      cmd.setAttribute('hidden', 'true');
      let links = document.getElementById('links').value
      let currentLinks = links[marker.id]
      let buttons = Array.prototype.slice.call(document.getElementsByTagName('button'))
      currentMarker = marker.id
      processButtons(buttons, currentLinks, marker.id, names, songs)

      const filteredSound = sounds.filter(
        (s) => s.components['gltf-model'].attrValue === entityTag,
      )
      if (Array.isArray(filteredSound) && filteredSound[0]) {
        let sound = filteredSound[0]
        sound.components.sound.playSound()
      }
    })

    marker.addEventListener('markerLost', function () {
      document.getElementsByClassName('legendText')[0].setAttribute('hidden', 'true')
      document.getElementsByClassName('songText')[0].setAttribute('hidden', 'true')
      document.getElementsByClassName('command')[0].removeAttribute('hidden');
      const entityTag = `#${marker.id}`
      const filteredSound = sounds.filter(
        (s) => s.components['gltf-model'].attrValue === entityTag,
      )
      if (Array.isArray(filteredSound) && filteredSound[0]) {
        let sound = filteredSound[0]
        sound.components.sound.stopSound()
      }
    })
  },
})

function processButtons(btnArray, currentLinks, marker, names, songs) {
  document.getElementsByClassName('legendText')[0].removeAttribute('hidden')
  document.getElementsByClassName('songText')[0].removeAttribute('hidden')
  document.getElementsByClassName('legendText')[0].textContent = names[marker]
  document.getElementsByClassName('songText')[0].textContent = songs[marker]
  btnArray.forEach((btn) => {
    let btnLabel = btn.id.replace('Btn', '')
    if (btnLabel === 'cam' || btnLabel === 'indx' || btnLabel === 'about') {
      btn.removeAttribute('hidden')
      return
    }
    if (currentLinks[btnLabel] !== undefined) {
      btn.removeAttribute('hidden')
      btn.setAttribute('onclick', `location.href='${currentLinks[btnLabel]}';`)
    } else {
      btn.removeAttribute('href')
      btn.setAttribute('hidden', 'true')
    }
  })
}