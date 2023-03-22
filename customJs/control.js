AFRAME.registerComponent('registerevents', {
    init: function () {
      let currentMarker = ''
      let marker = this.el
      let sounds = Array.prototype.slice.call(
        document.querySelectorAll('[sound]'),
      )
      let names = {
        escasez: 'Escasez Punk Rock',
        dw: 'Detective Wadd',
        procesx: 'Procesx Punk Medallo',
        sotano: 'El Sótano Fanzine',
        agente: 'Agente Extraño',
        coprofagia: 'Coprofagia',
        fango: 'Fango'
      }

      marker.addEventListener('markerFound', function () {
        let links = document.getElementById('links').value
        let b = window.parent.document.getElementsByTagName('body')[0]
        let currentLinks = links[marker.id]
        let buttons = Array.prototype.slice.call(
          b.getElementsByTagName('button'),
        )
        let info = b.getElementsByClassName('info')[0]
        info.setAttribute('hidden', 'true')

        currentMarker = marker.id
        processButtons(buttons, currentLinks, marker.id, names)

        const entityTag = `#${marker.id}`
        let sound =
          Array.isArray(sounds) &&
          sounds.filter(
            (s) => s.components['gltf-model'].attrValue === entityTag,
          )[0]
        sound.components.sound.playSound()
      })

      marker.addEventListener('markerLost', function () {
        console.log(marker.id)
        const entityTag = `#${marker.id}`
        console.log(Array.isArray(sounds))
        let sound =
          Array.isArray(sounds) &&
          sounds.filter(
            (s) => s.components['gltf-model'].attrValue === entityTag,
          )[0]
        sound.components.sound.stopSound()
      })
    },
  })

  function processButtons(btnArray, currentLinks, marker, names) {
    let b = window.parent.document.getElementsByTagName('body')[0]
    b.getElementsByClassName('legendText')[0].textContent = names[marker]
    btnArray.forEach((btn) => {
      let btnLabel = btn.id.replace('Btn', '')
      if (btnLabel === 'cam') {
        btn.removeAttribute('hidden');
        return
      }
      if (currentLinks[btnLabel] !== undefined) {
        btn.removeAttribute('hidden')
        btn.setAttribute(
          'onclick',
          `location.href='${currentLinks[btnLabel]}';`,
        )
      } else {
        btn.removeAttribute('href')
        btn.setAttribute('hidden', 'true')
      }
    })
  }