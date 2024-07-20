<?php
namespace App\Http\Controllers;
   
use BotMan\BotMan\BotMan;
use Illuminate\Http\Request;
use BotMan\BotMan\Messages\Incoming\Answer;
   
class BotManController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');
   
        $botman->hears('{message}', function($botman, $message) {
   
            if ($message == 'hi') {
                $this->askName($botman);
            }
            
            else{
                $botman->reply("Start saying hi.");
            }
   
        });
   
        $botman->listen();
    }
   
    /**
     * Place your BotMan logic here.
     */
    public function askName($botman)
    {
        $botman->ask('Hello! What is your Name?', function(Answer $answer, $conversation) {
            $name = $answer->getText();
   
            $this->say('Welcome to HotelHunt '.$name);
            $this->say('I am going to help you to receive room');

            $conversation->ask('which city do you like booking in ?', function(Answer $answer, $conversation) {
   
                $name = $answer->getText();
           
                $this->say('will search about this city '.$name);
            });
            
        });
    }




}
