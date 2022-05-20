<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Folder;
use App\Models\User;
use App\Models\SolutionsList;
use App\Models\Exercise;
use App\Models\Solution;

Route::get('/folder/{id}', function (Request $request, $id) {
    return ['folders' => Folder::where('parent_folder_id', $id)->get(), 'lists' => SolutionsList::where('folder_id', $id)->get()];
});

Route::post('/folder/{id}/add/{type}', function (Request $request, $id, $type) {
    if ($type === 'folder') {
        $folder = new Folder;
        $name = $request->name;
        while (Folder::where(['name' => $name, 'parent_folder_id' => $id])->first()) {
            $name = $name . ' (2)';
        }
        $folder->name = $name;
        $folder->parent_folder_id = $id;
        $folder->save();
    } elseif ($type === 'list') {
        $list = new SolutionsList;
        $name = $request->name;
        while (SolutionsList::where(['name' => $name, 'folder_id' => $id])->first()) {
            $name = $name . ' (2)';
        }
        $list->name = $name;
        $list->folder_id = $id;
        $list->save();
    } else {
        return response(400);
    }
});

Route::delete('/folder/{id}', function (Request $request, $id) {
    Folder::find($id)->update(['parent_folder_id' => 'removed']);
});

Route::delete('/list/{id}', function (Request $request, $id) {
    SolutionsList::find($id)->update(['folder_id' => 'removed']);
});

Route::put('/list/{id}', function (Request $request, $id) {
    $list = SolutionsList::find($id);
    $name = $request->name;
    while (SolutionsList::where(['name' => $name, 'folder_id' => $list->folder_id])->where('id', '!=', $id)->first()) {
        $name = $name . ' (2)';
    }
    $list->update(['name' => $name]);
});

Route::put('/folder/{id}', function (Request $request, $id) {
    $folder = Folder::find($id);
    $name = $request->name;
    while (Folder::where(['name' => $name, 'parent_folder_id' => $folder->folder_id])->where('id', '!=', $id)->first()) {
        $name = $name . ' (2)';
    }
    $folder->update(['name' => $name]);
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

Route::post('/list/{id}/add-exercise', function (Request $request, $id, $type) {
    return '';
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
    return Solution::find(Exercise::find($id)->solution_id);
});

Route::get('/solution/{id}/', function (Request $request, $id) {
    return Solution::find(Exercise::find($id)->solution_id);
});

Route::get('/exercise/{id}/all-solutions/', function (Request $request, $id) {
    return Solution::where('exercise_id', $id)->get();
});

Route::post('/exercise/{id}/solution/', function (Request $request, $id) {
    if ($request->input('type') == 'img') {
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
        }
    } elseif ($request->input('type') == 'canvas') {
        $existingSolution = Solution::where(['user_id' => $request->user()->id, 'exercise_id' => $id, 'type' => 'img'])->first();
        if ($existingSolution) {
            Storage::disk('public')->delete($existingSolution->content);
        }
        $image = base64_decode($request->input('content'));
        $path = md5($image).'.jpg';
        Storage::disk('public')->put($path, $image);
        $solution = Solution::updateOrCreate(['user_id' => $request->user()->id, 'exercise_id' => $id], ['type' => 'img', 'content' => $path]);
    } elseif ($request->input('type') == 'tex') {
        $solution = Solution::updateOrCreate(
            ['user_id' => $request->user()->id, 'exercise_id' => $id],
            ['type' => $request->input('type'), 'content' => $request->input('content')]
        );
    }
    // Później to będzie query dla admina
    $exercise = Exercise::find($id);
    if (is_null($exercise->solution_id)) {
        $exercise->solution_id = $solution->id;
        $exercise->save();
    }
    return $solution;
});
