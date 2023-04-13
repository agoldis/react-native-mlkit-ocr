package com.reactnativemlkitocr

import android.graphics.Point
import android.graphics.Rect
import android.net.Uri
import com.facebook.react.bridge.*
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.lang.Exception


class MlkitOcrModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return "MlkitOcr"
  }

  @ReactMethod
  fun detectFromUri(uri: String, promise: Promise) {
    return this.detectFromResource(uri, promise);
  }

  @ReactMethod
  fun detectFromFile(path: String, promise: Promise) {
    return this.detectFromResource(path, promise);
  }

  private fun detectFromResource(path: String, promise: Promise) {
    val image: InputImage;
    try {
      image = InputImage.fromFilePath(reactApplicationContext,  Uri.parse(path))
      val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
      recognizer.process(image).addOnSuccessListener { visionText ->
        promise.resolve(getDataAsArray(visionText))
      }.addOnFailureListener { e ->
        promise.reject(e);
        e.printStackTrace();
      }
    } catch (e: Exception) {
      promise.reject(e);
      e.printStackTrace();
    }
  }

  private fun getCoordinates(boundingBox: Rect?): WritableMap {
    val coordinates: WritableMap = Arguments.createMap()
    if (boundingBox == null) {
      coordinates.putNull("top")
      coordinates.putNull("left")
      coordinates.putNull("width")
      coordinates.putNull("height")
    } else {
      coordinates.putInt("top", boundingBox.top)
      coordinates.putInt("left", boundingBox.left)
      coordinates.putInt("width", boundingBox.width())
      coordinates.putInt("height", boundingBox.height())
    }
    return coordinates;
  }

  private fun getCornerPoints(pointsList: Array<Point>?): WritableArray {
    val p: WritableArray = Arguments.createArray()
    if (pointsList == null) {
      return p;
    }

    pointsList.forEach { point ->
      val i: WritableMap = Arguments.createMap()
      i.putInt("x", point.x);
      i.putInt("y", point.y);
      p.pushMap(i);
    }

    return p;
  }


  private fun getDataAsArray(visionText: Text): WritableArray? {
    val data: WritableArray = Arguments.createArray()

    for (block in visionText.textBlocks) {
      val blockElements: WritableArray = Arguments.createArray()
      for (line in block.lines) {
        val lineElements: WritableArray = Arguments.createArray()
        for (element in line.elements) {
          val e: WritableMap = Arguments.createMap()
          e.putString("text", element.text)
          e.putMap("bounding", getCoordinates(element.boundingBox))
          e.putArray("cornerPoints", getCornerPoints(element.cornerPoints))
          e.putString("confidence", element.confidence.toString())
          lineElements.pushMap(e)
        }
        val l: WritableMap = Arguments.createMap()
        val lCoordinates = getCoordinates(line.boundingBox)
        l.putString("text", line.text)
        l.putMap("bounding", lCoordinates)
        l.putArray("elements", lineElements)
        l.putArray("cornerPoints", getCornerPoints(line.cornerPoints))
        l.putString("confidence", line.confidence.toString())

        blockElements.pushMap(l)
      }

      val info: WritableMap = Arguments.createMap()


      info.putMap("bounding", getCoordinates(block.boundingBox))
      info.putString("text", block.text)
      info.putArray("lines", blockElements)
      info.putArray("cornerPoints", getCornerPoints(block.cornerPoints))
      data.pushMap(info)
    }
    return data
  }

}
