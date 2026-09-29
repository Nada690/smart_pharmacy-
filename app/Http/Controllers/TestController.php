<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function showMessage()
    {
        $name = "ندى";
        return view('welcome_user', ['userName' => $name]);
    }
}
