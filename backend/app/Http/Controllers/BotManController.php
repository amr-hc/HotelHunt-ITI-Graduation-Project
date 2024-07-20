<?php

namespace App\Http\Controllers;

use BotMan\BotMan\BotMan;
use Illuminate\Http\Request;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Conversations\Conversation;
use App\Models\Hotel;

class BotManController extends Controller
{
    public function handle()
    {
        $botman = app('botman');
   
        $botman->hears('{message}', function($botman, $message) {
            if ($message == 'hi') {
                $botman->startConversation(new WelcomeConversation);
            } else {
                $botman->reply("Start by saying 'hi'.");
            }
        });
   
        $botman->listen();
    }
}

class WelcomeConversation extends Conversation
{
    public function askName()
    {
        $this->ask('Hello! What is your name?', function(Answer $answer) {
            $name = $answer->getText();
            $this->say('Welcome to HotelHunt, ' . ucfirst($name) . ' !');
            $this->askCity();
        });
    }

    public function askCity()
    {
        $this->ask('Which city would you like to book in?', function(Answer $answer) {
            $city = $answer->getText();
            $hotels = Hotel::where('city', ucfirst($city))->get();

            if ($hotels->isEmpty()) {
                $this->say('Sorry, no hotels found in ' . $city);
                $this->askCity();
            } else {
                $this->say('Found ' . $hotels->count() . ' hotels in ' . $city);
                foreach ($hotels as $hotel) {
                    $this->say('<a href="http://localhost:4200/hotel/' . $hotel->id . '" target="_blank">' . $hotel->name . '</a>');
                }
            }
        });
    }

    public function run()
    {
        $this->askName();
    }
}
