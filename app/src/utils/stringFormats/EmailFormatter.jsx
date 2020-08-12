import React from 'react';

export default function emailFormatter() {
  return (
    <div>
      <title>W3.CSS Template</title>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <link
        rel="stylesheet"
        href="https://www.w3schools.com/w3css/4/w3.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Montserrat"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <body>
        <div class="w3-row" id="myGrid" style="margin-bottom:128px">
          <img src="/w3images/rocks.jpg" style="width:100%" />
        </div>

        <footer
          class="w3-container w3-padding-64 w3-light-grey w3-center w3-opacity w3-xlarge"
          style="margin-top:128px"
        >
          <i class="fa fa-facebook-official w3-hover-opacity"></i>
          <i class="fa fa-instagram w3-hover-opacity"></i>
          <i class="fa fa-linkedin w3-hover-opacity"></i>
          <p class="w3-medium">
            Powered by{' '}
            <a
              href="https://www.sportfolios.app"
              target="_blank"
              class="w3-hover-text-green"
            >
              w3.css
            </a>
          </p>
        </footer>
      </body>
    </div>
  );
}
