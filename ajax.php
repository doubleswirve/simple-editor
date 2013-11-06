<?php

$req = file_get_contents('php://input');

if (file_put_contents('data/post.json', $req) === FALSE) {
  echo "Fail";
}

echo "Success";