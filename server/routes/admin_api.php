<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Folder;
use App\Models\SolutionsList;
use App\Models\Exercise;
use App\Models\Solution;

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

Route::delete('/exercise/{id}', function (Request $request, $id) {
    Exercise::find($id)->update(['list_id' => 'removed']);
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

Route::post('/list/{id}/add-exercise', function (Request $request, $id) {
    $name = $request->name;
    $index = Exercise::select('index')
            ->where('list_id', $id)
            ->orderByDesc('index')
            ->limit(1)->get()->first();
    if ($index) {
        $index = $index->index;
    }
    if ($name) {
        $exercise = new Exercise;
        $exercise->list_id = $id;
        if ($index) {
            $exercise->index = $index+1;
        } else {
            $exercise->index = 0;
        }
        $exercise->name = $request->name;
        $exercise->save();
        return $exercise;
    }
});

Route::post('/list/{id}/add-exercises', function (Request $request, $id) {
    $names = $request->names;
    $index = Exercise::select('index')
            ->where('list_id', $id)
            ->orderByDesc('index')
            ->limit(1)->get()->first();
    if (!is_null($index)) {
        $index = $index->index;
    } else {
        $index = 0;
    }
    if ($names) {
        foreach ($names as $name) {
            $exercise = new Exercise;
            $exercise->list_id = $id;
            $exercise->index = $index;
            $index++;
            $exercise->name = $name;
            $exercise->save();
        }
    }
});

Route::put('/exercise/{id}/', function (Request $request, $id) {
    $updateArray = [];
    if ($request->name) {
        $updateArray['name'] = $request->name;
    }
    $updateArray['solution_id'] = $request->solution_id;
    return Exercise::find($id)->update($updateArray);
});
