<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:25','unique:users,phone'],
            'address' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:50'],
            'fname' => ['required', 'string', 'max:100'],
            'lname' => ['required', 'string', 'max:100'],
            'age' => ['required', 'integer', 'min:18'],
            'photo' => ['nullable', 'image', 'max:5120']
        ];

    }

    public function messages(): array
    {
        return [
            'email.email' => 'Please provide a valid email address.',
            'password.min' => 'Password must be at least :min characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
            'phone.max' => 'Phone number must not exceed :max characters.',
            'address.max' => 'Address must not exceed :max characters.',
            'role.max' => 'Role must not exceed :max characters.',
            'fname.max' => 'First name must not exceed :max characters.',
            'lname.max' => 'Last name must not exceed :max characters.',
            'age.integer' => 'Age must be a valid number.',
            'age.min' => 'Age must be at least :min years old.',
            'photo.image' => 'The file must be an image.',
            'photo.max' => 'The image size must not exceed :max kilobytes.',
        ];
    }
}
