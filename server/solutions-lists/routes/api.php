<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Folder;
use App\Models\SolutionsList;
use App\Models\Exercise;
use App\Models\Solution;

Route::get('/folder/{id}', function (Request $request, $id) {
    return ['folders' => Folder::where('parent_folder_id', $id)->get(), 'lists' => SolutionsList::where('folder_id', $id)->get()];
});

Route::get('/list/{id}', function (Request $request, $id) {
    $exercises = Exercise::where('list_id', $id)->get();
    $solutions = [];
    foreach ($exercises as $exercise) {
        $solution = Solution::find($exercise->solution_id);
        if (is_null($solution)) {
            $solution = ['type' => 'none'];
        }
        array_push($solutions, $solution);
    }
    return [$exercises, $solutions];
});

Route::get('/path/{type}/{id}', function (Request $request, $type, $id) {
    $path = [];
    if ($type === 'folder') {
        $parent_id = $id;
        while ($parent_id != 'root') {
            $parent_folder = Folder::find($parent_id);
            $parent_id = $parent_folder->parent_folder_id;
            array_unshift($path, $parent_folder);
        }
        array_unshift($path, ['name' => 'Strona główna', 'id' => 'root']);
        return $path;
    } elseif ($type === 'list') {
        $solutionsList = SolutionsList::find($id);
        array_push($path, $solutionsList);
        $parent_id = $solutionsList->folder_id;
        while ($parent_id != 'root') {
            $parent_folder = Folder::find($parent_id);
            $parent_id = $parent_folder->parent_folder_id;
            array_unshift($path, $parent_folder);
        }
        array_unshift($path, ['name' => 'Strona główna', 'id' => 'root']);
        return $path;
    }
});

Route::get('/exercise/{id}/solution/', function (Request $request, $id) {
    $solution = Solution::find(Exercise::find($id)->solution_id);
    if (is_null($solution)) {
        $solution = ['type' => 'none'];
    }
    return $solution;
});

Route::get('/solution/{id}/', function (Request $request, $id) {
    return Solution::find($id);
});

Route::get('/exercise/{id}/all-solutions/', function (Request $request, $id) {
    return Solution::where('exercise_id', $id)->get();
});

Route::post('/exercise/{id}/solution/', function (Request $request, $id) {
    if ($request->input('type') == 'img' && $request->validate([
        'File' => [
            ['file','max:10000','mimes:jpg,bmp,png']
        ]
    ])) {
        if ($request->file('File')->isValid()) {
            $existingSolution = Solution::where(['user_id' => $request->user()->id, 'exercise_id' => $id, 'type' => 'img'])->first();
            if ($existingSolution) {
                Storage::disk('public')->delete($existingSolution->content);
            }
            $request->File->storeAs('public', $request->File->hashName());
            $solution = Solution::updateOrCreate(
                ['user_id' => $request->user()->id, 'exercise_id' => $id],
                ['type' => 'img', 'content' => $request->File->hashName()]
            );
            return response('', 200);
        }
    } elseif ($request->input('type') == 'canvas' && $request->validate([
        'content' => [
            'max:70000000'
        ]
    ])) {
        $existingSolution = Solution::where(['user_id' => $request->user()->id, 'exercise_id' => $id, 'type' => 'img'])->first();
        if ($existingSolution) {
            Storage::disk('public')->delete($existingSolution->content);
        }
        $image = base64_decode($request->input('content'));
        $path = md5($image).'.jpg';
        Storage::disk('public')->put($path, $image);
        $solution = Solution::updateOrCreate(['user_id' => $request->user()->id, 'exercise_id' => $id], ['type' => 'img', 'content' => $path]);
        return response('', 200);
    } elseif ($request->input('type') == 'tex') {
        $solution = Solution::updateOrCreate(
            ['user_id' => $request->user()->id, 'exercise_id' => $id],
            ['type' => $request->input('type'), 'content' => $request->input('content')]
        );
        return response('', 200);
    }
    return response('', 400);
});
